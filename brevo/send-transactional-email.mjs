import Brevo from "@getbrevo/brevo";
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// addTwo.mjs
function sendTransactionalEmail(req) {
   if (req.body?.userDetails?.email) {
     console.log("SUCCESSFUL /interlibrary-loan-request POST");
     console.log("Beginning process to send email with Brevo");
     let apiInstance = new Brevo.TransactionalEmailsApi();
     let sendSmtpEmail = new Brevo.SendSmtpEmail();

     //creating the strings for our email with divergent inputs
     const objectIterator = (object) => {
       let temp = "";
       Object.keys(object).forEach((i) => {
         if (object[i] === undefined || null || "") {
         } else temp += `<li>${object[i].display}: ${object[i].value}</li>`;
       });
       return temp;
     };
     //all the string bits for our email
     let userDetails = req.body.userDetails;
     let requestDetails = req.body.requestDetails;
     let addInfo = req.body.additionalInformation;
     let userDeets = objectIterator(userDetails);
     let requestDeets = objectIterator(requestDetails);

     //Putting it all together into Brevo stuff
     sendSmtpEmail.subject = "New Interlibrary Loan Request";
     sendSmtpEmail.htmlContent = `<html><body><h1>New Interlibrary Loan Request</h1><h2>User Details</h2>
      <ul>
        ${userDeets}
      </ul>
    <h2>Request Details</h2>
      <ul>
        ${requestDeets}
      </ul>
    <p></p>Additional Information (if applicable): ${addInfo.value}</p>
    </body></html>`;
     sendSmtpEmail.sender = {
       name: "RMC Library Interlibrary Loan",
       email: "ill@rocky.edu",
     };
     sendSmtpEmail.to = [
       { email: "bradley.coffield@rocky.edu", name: "Brad Coffield" },
     ];
     sendSmtpEmail.replyTo = {
       email: "ill@rocky.edu",
       name: "RMC Library Interlibrary Loan",
     };
     //Actually send the email
     apiInstance.sendTransacEmail(sendSmtpEmail).then(
       function (data) {
         console.log(
           "API called successfully. Returned data: " + JSON.stringify(data)
         );

         res.status(200).send({ success: "Request successful." }).end();
       },
       function (error) {
         console.log("FAILED /interlibrary-loan-request POST");
         res
           .status(500)
           .send({ error: "Request failed. Please contact ill@rocky.edu" })
           .end();
         console.error(error);
       }
     );
   } else {
     console.log("FAILED /interlibrary-loan-request POST");
     res
       .status(500)
       .send({ error: "Request failed. Please contact ill@rocky.edu" })
       .end();
   }
}

export { sendTransactionalEmail };
