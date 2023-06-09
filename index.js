import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import probe from "probe-image-size";
const app = express();
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "wzuhalz9",
  dataset: "production",
  useCdn: true,
  apiVersion: "2022-04-28",
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getPosts() {
  const posts = await sanityClient.fetch('*[_type == "ebook"]');
  return posts;
}

// export async function createPost(post) {
//   const result = sanityClient.create(post)
//   return result
// }

// export async function updateDocumentTitle(_id, title) {
//   const result = sanityClient.patch(_id).set({title})
//   return result
// }

app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  console.log("Request type: ", req.method);
  next();
});

app.get("/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});

app.get("/new-books-api", (req, res) => {
  const apiUrl = `
https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,new%20books&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks&limit=50`;
  fetch(apiUrl)
    .then((resp) => resp.json())
    .then(async function (result) {
      // res.send(result)

      let realResults = result.docs;
      // res.send(realResults)
      let toSend = [];

      for (let i = 0; i < realResults.length; i++) {
        if (realResults[i].pnx.addata.isbn) {
          let tempEh = await probe(
            `https://syndetics.com/index.aspx?isbn=${realResults[i].pnx.addata.isbn[0]}/MC.JPG&client=primo`
          );
          console.log("here1");
          if (tempEh.width > 1) {
            console.log("here2");
            toSend.push({
              isbn: realResults[i].pnx.addata.isbn,
              title: realResults[i].pnx.display.title,
              type: realResults[i].pnx.display.type,
              recordid: realResults[i].pnx.control.recordid,
              sourcerecordid: realResults[i].pnx.control.sourcerecordid,
              coverImage: `https://syndetics.com/index.aspx?isbn=${realResults[i].pnx.addata.isbn[0]}/MC.JPG&client=primo`,
              primoPermalink: `https://trails-rocky.primo.exlibrisgroup.com/permalink/01TRAILS_ROCKY/1k8hqrr/${realResults[i].pnx.control.recordid}`,
            });
          }
        }
      }
      console.log("Results length:", toSend.length);
      res.send(toSend);
    });
  // res.send("Successful response.");
});
app.get("/new-books-api-and-send-to-sanity", (req, res) => {
  const apiUrl = `
https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,new%20books&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks&limit=50`;
  fetch(apiUrl)
    .then((resp) => resp.json())
    .then(async function (result) {
      // res.send(result)

      let realResults = result.docs;
      // res.send(realResults)
      let toSend = [];

      for (let i = 0; i < realResults.length; i++) {
        if (realResults[i].pnx.addata.isbn) {
          let tempEh = await probe(
            `https://syndetics.com/index.aspx?isbn=${realResults[i].pnx.addata.isbn[0]}/MC.JPG&client=primo`
          );
          console.log("here1");
          if (tempEh.width > 1) {
            console.log("here2");
            toSend.push({
              isbn: realResults[i].pnx.addata.isbn,
              title: realResults[i].pnx.display.title,
              type: realResults[i].pnx.display.type,
              recordid: realResults[i].pnx.control.recordid,
              sourcerecordid: realResults[i].pnx.control.sourcerecordid,
              coverImage: `https://syndetics.com/index.aspx?isbn=${realResults[i].pnx.addata.isbn[0]}/MC.JPG&client=primo`,
              primoPermalink: `https://trails-rocky.primo.exlibrisgroup.com/permalink/01TRAILS_ROCKY/1k8hqrr/${realResults[i].pnx.control.recordid}`,
            });
          }
        }
      }
      console.log("Results length:", toSend.length);
      let ids = [];
      if (toSend.length > 0) {
        toSend.forEach((book) => {
          let processed = {
            _type: "newBooks",
            title: book.title[0],
            sourcerecordid: book.sourcerecordid[0],
            recordid: book.recordid[0],
            isbn: book.isbn,
            permalink: book.primoPermalink,
            coverImageURL: book.coverImage,
          };
          sanityClient.create(processed).then((res) => {
            ids.push(res._id);
            console.log(`New book was created, document ID is ${res._id}`);
          });
        });
        res.send(ids);
      } else res.send("Primo results empty so no data sent to Sanity.");
    });
  // res.send("Successful response.");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
