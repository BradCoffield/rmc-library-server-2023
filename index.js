import express from 'express';
const app = express();

app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  console.log("Request type: ", req.method);
  next();
});

app.get('/', (req, res) => {
    res.send('Choo Choo! Welcome to your Express app 🚅');
})

app.get("/json", (req, res) => {
    res.json({"Choo Choo": "Welcome to your Express app 🚅"});
})



app.get("/new-books-api", (req, res) => {
  let probe = require("probe-image-size");

  // const apiUrl = `https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=any,contains,oxford&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&tab=LibraryCatalog&limit=150&scope=MyInstitution&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47&qInclude=location_code,include,3380%E2%80%93463253560003380%E2%80%93newbooks`;
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
      console.log(toSend, toSend.length);
      res.send(toSend);
    });
  // res.send("Successful response.");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})