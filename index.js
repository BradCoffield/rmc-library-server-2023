import * as dotenv from "dotenv";
dotenv.config();
import compression from "compression";
import express from "express";
const app = express();
app.use(compression());

import { createClient } from "@sanity/client";
import cors from "cors"
app.use(cors());

export const sanityClient = createClient({
  projectId: "wzuhalz9",
  dataset: "production",
  useCdn: true,
  apiVersion: "2022-04-28",
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getEBooks() {
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
  console.log(req.body);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
