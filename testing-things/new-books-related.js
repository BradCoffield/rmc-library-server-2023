
/* 
I just pulled this from index.js.
This was built incrementally to get me to the point where I could create the Railway cron job
That lives separately: https://github.com/BradCoffield/rmc-library-railway-new-books-cron
This is saved just cuz

*/

app.get("/new-books-api", (req, res) => {
  const startTime = Date.now();
  const apiUrl = `
https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,book&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks&limit=150`;
  // https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,new%20books&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks&limit=50`;
  console.log(`Fetching:  ${apiUrl}`);
  fetch(apiUrl)
    .then((resp) => resp.json())
    .then(async function (result) {
      // res.send(result)

      let realResults = result.docs;
      // res.send(realResults)
      let toSend = [];

      console.log("Investigating cover images for the book results.");
      for (let i = 0; i < realResults.length; i++) {
        if (realResults[i].pnx.addata.isbn) {
          let tempEh = await probe(
            `https://syndetics.com/index.aspx?isbn=${realResults[i].pnx.addata.isbn[0]}/MC.JPG&client=primo`
          );
          // console.log("here1");
          if (tempEh.width > 1) {
            // console.log("cover image present");
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
          // else {console.log("cover image not present")}
        }
      }
      console.log("Results length:", toSend.length);
      const msElapsed = Date.now() - startTime;
      console.log(`This all took ${msElapsed / 1000} seconds to complete.`);
      res.send(toSend);
    });
  // res.send("Successful response.");
});
app.get("/new-books-api-and-send-to-sanity", (req, res) => {
  const startTime = Date.now();
  const apiUrl = `
https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,book&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks&limit=150`;
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
          // console.log("here1");
          if (tempEh.width > 1) {
            console.log("cover image present");
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
        const msElapsed = Date.now() - startTime;
        console.log(`This all took ${msElapsed / 1000} seconds to complete.`);

        res.send(ids);
      } else res.send("Primo results empty so no data sent to Sanity.");
    });
  // res.send("Successful response.");
});
app.get("/new-books-api-and-pqueue-send-to-sanity", (req, res) => {
  const queue = new PQueue({
    concurrency: 5,
    interval: 1000 / 25,
  });

  const startTime = Date.now();
  const apiUrl = `
https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,book&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks&limit=150`;
  fetch(apiUrl)
    .then((resp) => resp.json())
    .then(async function (result) {
      // res.send(result)

      let realResults = result.docs;
      // res.send(realResults)
      let toSend = [];
      console.log("Testing ISBNs for real book covers. . .");

      for (let i = 0; i < realResults.length; i++) {
        if (realResults[i].pnx.addata.isbn) {
          let tempEh = await probe(
            `https://syndetics.com/index.aspx?isbn=${realResults[i].pnx.addata.isbn[0]}/MC.JPG&client=primo`
          );
          // console.log("here1");
          if (tempEh.width > 1) {
            // console.log("cover image present");
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
      console.log(
        "Number of processed new books ready for export:",
        toSend.length
      );
      let ids = [];
      if (toSend.length > 0) {
        /* 
If we have results to send to Sanity lets clear out where they're going so it's as up-to-date as possible
*/

        console.log("Deleting newBooks from Sanity. . .");

        sanityClient
          .delete({ query: '*[_type == "newBooks"]' })
          .then(() => {
            console.log("The documents were deleted.");
            console.log("Sending the new new books to Sanity.");
            toSend.forEach((book, index, array) => {
              let processed = {
                _type: "newBooks",
                _id: book.isbn[0],
                title: book.title[0],
                sourcerecordid: book.sourcerecordid[0],
                recordid: book.recordid[0],
                isbn: book.isbn,
                permalink: book.primoPermalink,
                coverImageURL: book.coverImage,
              };
              queue.add(() => sanityClient.createIfNotExists(processed));
              // We use this to know when the q is populated and close the connection
              if (index === array.length - 1) {
                console.log("AH YES");
                const msElapsed = Date.now() - startTime;
                console.log(
                  `This all took ${msElapsed / 1000} seconds to complete.`
                );
                res.send("Process complete.").end();
              }
            });
          })
          .catch((err) => {
            console.error("Delete failed: ", err.message);
          });

        // res.sendStatus(200).end();
      } else res.send("Primo results empty so no data sent to Sanity.").end();
    });
  // res.send("Successful response.");
});
