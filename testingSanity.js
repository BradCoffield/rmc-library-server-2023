import * as dotenv from "dotenv"; 
dotenv.config();
import { createClient } from "@sanity/client";
import * as fs from "fs";
const result = JSON.parse(fs.readFileSync("./newbooks.json"));

const sanityClient = createClient({
  projectId: "wzuhalz9",
  dataset: "production",
  useCdn: true,
  apiVersion: "2022-04-28",
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

// uses GROQ to query content: https://www.sanity.io/docs/groq
// async function getPosts() {
//   const posts = await sanityClient.fetch('*[_type == "newBooks"]');
//   console.log(posts)
//   return posts;
// }
// getPosts()

// use GROQ to clear out all content from new books in sanity
 
// sanityClient
//   .delete({query: '*[_type == "newBooks"]'})
//   .then(() => {
//     console.log('The documents were deleted.')
//   })
//   .catch((err) => {
//     console.error('Delete failed: ', err.message)
//   })
 
 


// result.forEach((book) => {

// let processed = {
//   _type: "newBooks",
//   title: book.title[0],
//   sourcerecordid: book.sourcerecordid[0],
//   recordid: book.recordid[0],
//   isbn: book.isbn,
//   permalink: book.primoPermalink,
//   coverImageURL: book.coverImage,
// };
// sanityClient.create(processed).then((res) => {
//   console.log(`New book was created, document ID is ${res._id}`);
// });

// });
