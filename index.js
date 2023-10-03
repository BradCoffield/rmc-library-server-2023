import { testAsync } from "./testing-things/test-async.mjs";
import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());
import cors from "cors";
app.use(cors());

import { sendTransactionalEmail } from "./brevo/send-interlibrary-loan-emails.mjs";
import { sendInterlibraryLoanRequestToSanity } from "./sanity/send-interlibrary-request-data-to-sanity.mjs";

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

app.get("/test-async", async (req, res, next) => {
  try {
    let someResults = await testAsync("1");
    res.send(someResults);
  } catch (error) {
    console.log("I'm in the catch in index. halp.");
    console.log(error);
    //Next, you pass the error into an Express error handler with the next argument.
    return next(error);
  }
});

app.post("/interlibrary-loan-request", async (req, res) => {
  let requestData = req.body;
  try {
    const destinationEmail = requestData.userDetails.email.value;
    const destinationPersonName =
      requestData.userDetails.firstName.value +
      "" +
      requestData.userDetails.lastName.value;

    sendInterlibraryLoanRequestToSanity(requestData);

    sendTransactionalEmail(
      requestData,
      destinationEmail,
      destinationPersonName
    );

    // sendTransactionalEmail(
    //   requestData,
    //   "ill@rocky.edu",
    //   "RMC Interlibrary Loan"
    // );
    res.status(200).end();
  } catch (error) {
    console.log("I'm in the catch in index. halp.");
    console.log(error);
    //Next, you pass the error into an Express error handler with the next argument.
    res
      .status(500)
      .send({ error: "Request failed. Please contact ill@rocky.edu" })
      .end();
    return next(error);
  }
  // console.log("POST Contents:", req.body);
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
