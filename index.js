import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());
import cors from "cors";
app.use(cors());
import { sendTransactionalEmail } from "./brevo/send-transactional-email.mjs";
import { sendInterlibraryLoanRequestToSanity } from "./sanity/send-interlibrary-request-data.mjs";

// var defaultClient = Brevo.ApiClient.instance;
// var apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = process.env.BREVO_API_KEY;

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
    console.log("POST Contents:", req.body);
    // const bookModel = {
    //   _type: "interlibraryLoanRequest",
    //   requestedMaterialType: "Book",
    //   date: new Date().toLocaleDateString("en-CA"),
    //   borrowerType: "Student",
    //   requestedButUnfulfilled: false,
    //   requestedBookDetails: {
    //     ISBN: "100000",
    //     bookAuthor: "test2222222",
    //     bookTitle: "Test10000",
    //   },
    // };
    // sanityClient.create(bookModel).then((res) => {
    //   console.log(`Created, document ID is ${res._id}`);
    // });
    sendTransactionalEmail(req, res)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
