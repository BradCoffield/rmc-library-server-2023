import { sendTransactionalEmail } from "../brevo/send-interlibrary-loan-emails.mjs";
import { sendInterlibraryLoanRequestToSanity } from "../sanity/send-interlibrary-request-data-to-sanity.mjs";

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    throw new Error("Invalid JSON body");
  }
}

export default async function handler(req, res) {
  // CORS headers (adjust origin as needed)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const requestData = await readJson(req);

    const destinationEmail = requestData?.userDetails?.email?.value;
    const destinationPersonName = `${requestData?.userDetails?.firstName?.value || ""} ${requestData?.userDetails?.lastName?.value || ""}`.trim();

    if (!destinationEmail) {
      res.status(400).json({ error: "Missing userDetails.email.value" });
      return;
    }

    // Perform Sanity write and send emails
    await sendInterlibraryLoanRequestToSanity(requestData);

    await Promise.all([
      sendTransactionalEmail(
        requestData,
        destinationEmail,
        destinationPersonName || "Requester"
      ),
      sendTransactionalEmail(
        requestData,
        "ill@rocky.edu",
        "RMC Interlibrary Loan"
      ),
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("/interlibrary-loan-request error", error);
    res
      .status(500)
      .json({ error: "Request failed... Please contact ill@rocky.edu" });
  }
}
