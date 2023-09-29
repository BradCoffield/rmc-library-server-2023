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

 


/* 
use GROQ to clear out all content from "new books" in sanity
*/
 
// sanityClient
//   .delete({query: '*[_type == "newBooks"]'})
//   .then(() => {
//     console.log('The documents were deleted.')
//   })
//   .catch((err) => {
//     console.error('Delete failed: ', err.message)
//   })


/* 
use GROQ to clear out all content from interlibrary loan requests in sanity
*/

// sanityClient
//   .delete({ query: '*[_type == "interlibraryLoanRequest"]' })
//   .then(() => {
//     console.log("The documents were deleted.");
//   })
//   .catch((err) => {
//     console.error("Delete failed: ", err.message);
//   });
 
  
