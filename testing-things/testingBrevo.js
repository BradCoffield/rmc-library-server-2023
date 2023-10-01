//https://github.com/getbrevo/brevo-node - following getting started here
import * as dotenv from "dotenv";
dotenv.config();
import Brevo from "@getbrevo/brevo"


// Setting up
var defaultClient = Brevo.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

/* Most basic example */
// var api = new Brevo.AccountApi();
// api.getAccount().then(
//   function (data) {
//     console.log(data)
//     console.log("API called successfully. Returned data: " + data);
//   },
//   function (error) {
//     console.error(error);
//   }
// );

//https://developers.brevo.com/reference/sendtransacemail
let apiInstance = new Brevo.TransactionalEmailsApi();
let sendSmtpEmail = new Brevo.SendSmtpEmail();

sendSmtpEmail.subject = "New Interlibrary Loan Request";
sendSmtpEmail.htmlContent =
  "<html><body><h1>New Interlibrary Loan Request</h1><h2>Details</h2><ul><li>This is a test</li><li>This is a test</li><li>This is a test</li><li>This is a test</li><li>This is a test</li></ul></body></html>";
sendSmtpEmail.sender = { name: "RMC Library", email: "library@rocky.edu" };
sendSmtpEmail.to = [{ email: "bradley.coffield@rocky.edu", name: "Brad Coffield" }];
sendSmtpEmail.replyTo = { email: "library@rocky.edu", name: "RMC Library" };
// sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
// sendSmtpEmail.params = {
//   parameter: "My param value",
//   subject: "common subject",
// };

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
  },
  function (error) {
    console.error(error);
  }
);
