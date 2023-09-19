import axios from "axios";
const dataPackage = {
  userDetails: {
    firstName: "a",
    lastName: "a",
    email: "a@a",
    borrowerType: "Student",
  },
  requestDetails: {
    materialType: "Book",
    bookTitle: "test!",
    bookAuthor: "yay!",
    bookISBN: "100",
  },
  additionalInformation: "Please work!!",
};

/* 
TESTING LOCALLY
*/
//https://stackoverflow.com/questions/50330795/fetch-api-error-handling
fetch("http://localhost:3001/interlibrary-loan-request", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(dataPackage),
})
  .then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Success");
    console.log(data);
  })
  .catch((error) => {
    if (typeof error.json === "function") {
      error
        .json()
        .then((jsonError) => {
          console.log("Json error from API");
          console.log(jsonError);
        })
        .catch((genericError) => {
          console.log("Generic error from API");
          console.log(error.statusText);
        });
    } else {
      console.log("Fetch error");
      console.log(error);
    }
  });






// (async () => {
//    await axios.post("http://localhost:3001/interlibrary-loan-request", {
//     userDetails: {
//       firstName: "a",
//       lastName: "a",
//       email: "a@a",
//       borrowerType: "Student",
//     },
//     requestDetails: {
//       materialType: "Book",
//       bookTitle: "test!",
//       bookAuthor: "yay!",
//       bookISBN: "100",
//     },
//     additionalInformation: "Please work!!",
//   });
// })()

/* 
TESTING THE ACTUAL SERVER...
*/
// const dataPackage = {
//   userDetails: {
//     firstName: "a",
//     lastName: "a",
//     email: "",
//     borrowerType: "Student",
//   },
//   requestDetails: {
//     materialType: "Book",
//     bookTitle: "test!",
//     bookAuthor: "yay!",
//     bookISBN: "100",
//   },
//   additionalInformation: "Please work!!",
// };
// async function postJSON(data) {
//   try {
//     const response = await fetch(
//       "https://expressjs-server-production-026f.up.railway.app/interlibrary-loan-request",
//       {
//         method: "POST",  
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     const result = await response.json();
   
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// }

// postJSON(dataPackage);