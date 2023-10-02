import { testAsync } from "./testing-things/test-async.mjs";
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

//testing async modules and how to def handle their errors

app.get("/test-async", async (req, res,next) => {
  try {
    let someResults = await testAsync("1")
    res.send(someResults);
  } catch (error) {
    console.log("I'm in the catch in index. halp.")
    console.log(error);
    //Next, you pass the error into an Express error handler with the next argument.
    return next(error);
  }
});



/* 
TODO: make sure this is a POST whenever I'm done testing
*/
app.post("/interlibrary-loan-request", (req, res) => {
  // console.log("POST Contents:", req.body);
  const reqData = {
    userDetails: {
      firstName: {
        value: "a",
        display: "First Name",
      },
      lastName: {
        value: "a",
        display: "Last Name",
      },
      email: {
        value: "a@a",
        display: "Email",
      },
      borrowerType: {
        value: "Student",
        display: "Borrower Type",
      },
    },
    requestDetails: {
      materialType: {
        value: "Book",
        display: "Book",
      },
      bookTitle: {
        value: "book title!11111",
        display: "Book Title",
      },
      bookAuthor: {
        value: "author shenanigans!111",
        display: "Author",
      },
      bookISBN: {
        value: "102030303011",
        display: "ISBN",
      },
    },
    additionalInformation: {
      value: "asdfsdfsdfasdf111",
      display: "Additional Information",
    },
  };
  sendInterlibraryLoanRequestToSanity(reqData)


  

 
  // sendTransactionalEmail(req, res)
});
app.use((err, req, res, next) => {
  // Simple error handling here... in real life we might
  // want to be more specific
  console.log(`I'm the error handler. '${err.message}'`);
  res.status(500);
  res.json({ error: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
