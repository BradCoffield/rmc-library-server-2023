import * as dotenv from "dotenv";
dotenv.config();
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "wzuhalz9",
  dataset: "production",
  useCdn: true,
  apiVersion: "2022-04-28",
  token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

function sendInterlibraryLoanRequestToSanity(formData) {
  console.log("yeee");
  const sendToSanity = (data) => {
    sanityClient.create(data).then((res) => {
      console.log(`Created, document ID is ${res._id}`);
    });
    return;
  };
  //so i'll do this if statement for each possible material type and use the models I defined inside of them. I should pull out the sanityclient into its own thing and just call that function sending the data into it
  if (formData?.requestDetails?.materialType?.value === "Book") {
    console.log("heyy");
    const bookModel = {
      _type: "interlibraryLoanRequest",
      requestedMaterialType: formData.requestDetails.materialType.value,
      date: new Date().toLocaleDateString("en-CA"),
      borrowerType: formData.userDetails.borrowerType.value,
      requestedButUnfulfilled: false,
      requestedBookDetails: {
        ISBN: "" || formData?.requestDetails?.bookISBN?.value,
        bookAuthor: formData.requestDetails.bookAuthor.value,
        bookTitle: formData.requestDetails.bookTitle.value,
      },
    };
    sendToSanity(bookModel);
  }

  if (formData?.requestDetails?.materialType?.value === "BookChapter") {
    const bookChapterModel = {
      _type: "interlibraryLoanRequest",
      requestedMaterialType: formData.requestDetails.materialType.value,
      date: new Date().toLocaleDateString("en-CA"),
      borrowerType: formData.userDetails.borrowerType.value,
      requestedBookChapterDetails: {
        bookChapterBookTitle:
          formData?.requestDetails?.bookChapterBookTitle?.value,
        bookChapterISBN: formData?.requestDetails?.bookChapterISBN?.value,
        bookChapterArticleTitle:
          formData?.requestDetails?.bookChapterArticleTitle?.value,
        bookChapterAuthor: formData?.requestDetails?.bookChapterAuthor?.value,
      },
    };
    sendToSanity(bookChapterModel);
  }
  if (formData?.requestDetails?.materialType?.value === "JournalArticle") {
    const journalArticleModel = {
      _type: "interlibraryLoanRequest",
      requestedMaterialType: formData.requestDetails.materialType.value,
      date: new Date().toLocaleDateString("en-CA"),
      borrowerType: formData.userDetails.borrowerType.value,
      requestedJournalArticleDetails: {
        journalDate: formData?.requestDetails?.journalDate?.value,
        journalVolumeIssue: formData?.requestDetails?.journalVolumeIssue?.value,
        journalPages: formData?.requestDetails?.journalPages?.value,
        journalTitle: formData?.requestDetails?.journalTitle?.value,
        journalArticleTitle:
          formData?.requestDetails?.journalArticleTitle?.value,
        journalPMID: formData?.requestDetails?.journalPMID?.value,
        journalDOI: formData?.requestDetails?.journalDOI?.value,
        journalArticleAuthor:
          formData?.requestDetails?.journalArticleAuthor?.value,
      },
    };
    sendToSanity(journalArticleModel);
  }
  if (formData?.requestDetails?.materialType?.value === "DissertationThesis") {
    const dissertationModel = {
      _type: "interlibraryLoanRequest",
      requestedMaterialType: formData.requestDetails.materialType.value,
      date: new Date().toLocaleDateString("en-CA"),
      borrowerType: formData.userDetails.borrowerType.value,
      requestedDissertationThesisDetails: {
        dissertationThesisTitle:
          formData?.requestDetails?.dissertationThesisTitle?.value,
        dissertationThesisAuthor:
          formData?.requestDetails?.dissertationThesisAuthor?.value,
        dissertationThesisAdditionalInformation:
          formData?.requestDetails?.dissertationThesisAdditionalInformation
            ?.value,
      },
    };
    sendToSanity(dissertationModel);
  }
  if (formData?.requestDetails?.materialType?.value === "Other") {
    const otherMaterialModel = {
      _type: "interlibraryLoanRequest",
      requestedMaterialType: formData.requestDetails.materialType.value,
      date: new Date().toLocaleDateString("en-CA"),
      borrowerType: formData.userDetails.borrowerType.value,
      requestForOtherType: {
        otherRequestTypeInformation:
          formData?.requestDetails?.otherRequestTypeInformation?.value,
      },
    };
    sendToSanity(otherMaterialModel);
  }
}

export { sendInterlibraryLoanRequestToSanity };
