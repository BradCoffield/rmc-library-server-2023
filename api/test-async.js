import { testAsync } from "../testing-things/test-async.mjs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const someResults = await testAsync("1");
    res.status(200).json(someResults);
  } catch (error) {
    console.error("/test-async error", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
}
