import axios from "axios";
 
 
 
(async (params) => {
  // Test the above app using Axios
 

  // const axios = require("axios");
  // Prints "{ answer: 42 }"
  await axios.post("http://localhost:3001/interlibrary-loan-request", {
    answer: 42,
  });
})()

