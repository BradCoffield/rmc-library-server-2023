import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());
import cors from "cors";
app.use(cors());
import { sendTransactionalEmail } from "./brevo/send-transactional-email.mjs";
import { sendInterlibraryLoanRequestToSanity } from "./sanity/send-interlibrary-request-data-to-sanity.mjs";

// var defaultClient = Brevo.ApiClient.instance;
// var apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = process.env.BREVO_API_KEY;


app.use(express.json());
app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  console.log("Request type: ", req.method);
  next();
});

app.get("/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});
/* 
TODO: make sure this is a POST whenever I'm done testing
*/
app.post("/interlibrary-loan-request", (req, res) => {
  console.log("POST Contents:", req.body);
  // const reqData = {
  //   userDetails: {
  //     firstName: {
  //       value: "a",
  //       display: "First Name",
  //     },
  //     lastName: {
  //       value: "a",
  //       display: "Last Name",
  //     },
  //     email: {
  //       value: "a@a",
  //       display: "Email",
  //     },
  //     borrowerType: {
  //       value: "Student",
  //       display: "Borrower Type",
  //     },
  //   },
  //   requestDetails: {
  //     materialType: {
  //       value: "Book",
  //       display: "Book",
  //     },
  //     bookTitle: {
  //       value: "book title!11111",
  //       display: "Book Title",
  //     },
  //     bookAuthor: {
  //       value: "author shenanigans!111",
  //       display: "Author",
  //     },
  //     bookISBN: {
  //       value: "102030303011",
  //       display: "ISBN",
  //     },
  //   },
  //   additionalInformation: {
  //     value: "asdfsdfsdfasdf111",
  //     display: "Additional Information",
  //   },
  // };
  sendInterlibraryLoanRequestToSanity(req.body)

  

 
  // sendTransactionalEmail(req, res)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
