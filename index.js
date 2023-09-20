import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());
import cors from "cors";
app.use(cors());
import Brevo from "@getbrevo/brevo";
var defaultClient = Brevo.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

/* 
Sanity.io
*/
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "wzuhalz9",
  dataset: "production",
  useCdn: true,
  apiVersion: "2022-04-28",
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

// uses GROQ to query content: https://www.sanity.io/docs/groq
// export async function getEBooks() {
//   const posts = await sanityClient.fetch('*[_type == "ebook"]');
//   return posts;
// }

// export async function createPost(post) {
//   const result = sanityClient.create(post)
//   return result
// }

// export async function updateDocumentTitle(_id, title) {
//   const result = sanityClient.patch(_id).set({title})
//   return result
// }
app.use(express.json());
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  console.log("Request type: ", req.method);
  next();
});

app.get("/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});

app.post("/interlibrary-loan-request", (req, res) => {
  var defaultClient = Brevo.ApiClient.instance;
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  console.log("POST Contents:", req.body);
  if (req.body?.userDetails?.email) {
    console.log("SUCCESSFUL /interlibrary-loan-request POST");
    console.log("Beginning process to send email with Brevo")
    let apiInstance = new Brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

const objectIterator = (object) => {
  let temp = ""
  Object.keys(object).forEach((i) => {
    temp += `<li>${object[i]}</li>`;
  })
  return temp
}
  
    let userDetails = req.body.userDetails
    let requestDetails = req.body.requestDetails
    let addInfo = req.body.additionalInformation
    let userDeets = objectIterator(userDetails)
    let requestDeets = objectIterator(requestDetails)
   

    sendSmtpEmail.subject = "New Interlibrary Loan Request";
    sendSmtpEmail.htmlContent = `<html><body><h1>New Interlibrary Loan Request</h1><h2>User Details</h2>
      <ul>
        ${userDeets}
      </ul>
    <h2>Request Details</h2>
      <ul>
        ${requestDeets}
      </ul>
    <p></p>Additional Information (if applicable): ${addInfo}</p>


    
    
    </body></html>`;
    sendSmtpEmail.sender = { name: "RMC Library Interlibrary Loan", email: "ill@rocky.edu" };
    sendSmtpEmail.to = [
      { email: "bradley.coffield@rocky.edu", name: "Brad Coffield" },
    ];
    sendSmtpEmail.replyTo = { email: "library@rocky.edu", name: "RMC Library" };
apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );  res.status(200).send({ success: "Request successful." }).end();
  },
  function (error) {
    console.log("FAILED /interlibrary-loan-request POST");
    res
      .status(500)
      .send({ error: "Request failed. Please contact ill@rocky.edu" })
      .end();
    console.error(error);
  }
);
  
  } else {
    console.log("FAILED /interlibrary-loan-request POST");
    res
      .status(500)
      .send({ error: "Request failed. Please contact ill@rocky.edu" })
      .end();
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
