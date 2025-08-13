import * as dotenv from "dotenv";
dotenv.config();
import Brevo from "@getbrevo/brevo";
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;


const sendTransactionalEmail = async (
  requestData,
  destinationEmail,
  destinationPersonName
) => {


  console.log("/interlibrary-loan-request POST");
  console.log("Beginning process to send email with Brevo");
  let apiInstance = new Brevo.TransactionalEmailsApi();
  let sendSmtpEmail = new Brevo.SendSmtpEmail();

  //creating the strings for our email 
  const objectIterator = (object) => {
    let temp = "";
    Object.keys(object).forEach((i) => {
      const field = object[i];
      if (
        field &&
        typeof field.display !== "undefined" &&
        typeof field.value !== "undefined" &&
        field.value !== null &&
        field.value !== ""
      ) {
        temp += `<li>${field.display}: ${field.value}</li>`;
      }
    });
    return temp;
  };
  //all the string bits for our email
  const addInfo = requestData.additionalInformation;
  const userDeets = objectIterator(requestData.userDetails);
  const requestDeets = objectIterator(requestData.requestDetails);

console.log(destinationEmail, destinationPersonName);

  //Putting it all together into Brevo stuff

  sendSmtpEmail.subject = "New Interlibrary Loan Request";
  sendSmtpEmail.htmlContent = `<html><body><h1>New Interlibrary Loan Request</h1><h2>User Details</h2>
      <ul>
        ${userDeets}
      </ul>
    <h2>Request Details</h2>
      <ul>
        ${requestDeets}
        <li>Additional Information (if applicable): ${addInfo.value}</li>
      </ul>
     
    </body></html>`;
  sendSmtpEmail.sender = {
    name: "RMC Library Interlibrary Loan",
    email: "ill@rocky.edu",
  };

  sendSmtpEmail.to = [{ email: destinationEmail, name: destinationPersonName }];
  sendSmtpEmail.replyTo = {
    email: "ill@rocky.edu",
    name: "RMC Library Interlibrary Loan",
  };
  // Actually send the email (awaitable for serverless)
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      "Brevo API called successfully. Returned data: " + JSON.stringify(data)
    );
    return data;
  } catch (error) {
    console.log("Failed sending transactional email.");
    console.log(error);
    throw error;
  }
};
 
export { sendTransactionalEmail };
