import axios from "axios";
 
 
 
(async (params) => {
  // Test the above app using Axios
 

  // const axios = require("axios");
  // Prints "{ answer: 42 }"
  await axios.post("http://localhost:3001/interlibrary-loan-request", {
    userDetails: {
      firstName: "a",
      lastName: "a",
      email: "",
      borrowerType: "Student",
    },
    requestDetails: {
      materialType: "Book",
      bookTitle: "test!",
      bookAuthor: "yay!",
      bookISBN: "100",
    },
    additionalInformation: "Please work!!",
  });
})()

