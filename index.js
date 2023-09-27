import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());
import cors from "cors";
app.use(cors());
app.use(express.json());

import sendTransactionalEmail from "./brevo/send-transactional-email";

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


app.use((req, res, next) => {
  console.log("Time: ", Date.now());
  console.log("Request type: ", req.method);
  next();
});

app.get("/", (req, res) => {
  res.send("Choo Choo! Welcome to your Express app 🚅");
});

app.post("/interlibrary-loan-request", (req, res) => {
  sendTransactionalEmail(req, "bradley.coffield@rocky.edu", "Bradd Coffield")

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
