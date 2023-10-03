var url = "http://localhost:3013/interlibrary-loan-request";
var data = {
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
      value: "bradley.coffield@rocky.edu",
      display: "Email",
    },
    borrowerType: {
      value: "Staff",
      display: "Borrower Type",
    },
  },
  requestDetails: {
    materialType: {
      value: "BookChapter",
      display: "Book Chapter",
    },
    bookChapterBookTitle: {
      value: "bok chapter book title",
      display: "Book Title",
    },
    bookChapterAuthor: {
      value: "joey!",
      display: "Chapter Author",
    },
    bookChapterTitle: {
      value: "book chapter book title",
      display: "Chapter Title",
    },
    bookChapterISBN: {
      value: "120938123",
      display: "ISBN",
    },
  },
  additionalInformation: {
    value: "external addy111123",
    display: "Additional Information",
  },
};
fetch(url, {
  body: JSON.stringify(data),
  headers: {
    dataType: "json",
    "content-type": "application/json",
  },
  method: "POST",
  redirect: "follow",
})
  .then((response) => {
    if (response.status === 200) {
      console.log(response);
    } else {
      throw new Error("Something went wrong on API server!");
    }
  })
  .catch((error) => {
    console.error(error);
  });
