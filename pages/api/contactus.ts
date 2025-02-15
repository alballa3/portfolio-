import { GoogleSpreadsheet } from "google-spreadsheet";
import { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "google-auth-library";

export default async function Handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const key = process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, "\n") as string;
    const auth = new JWT({
      email: process.env.GOOGLE_SHEET_EMAIL,
      key: key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet("1h1yvSjchl_Obms8JyxmogUDrnOMluSOaQHzyScxN43A", auth);

    await doc.loadInfo(); // Ensure sheet info is loaded before trying to access it
    const sheet = doc.sheetsById[0];

    // Add row to the sheet
    const row = await sheet.addRow({
      email,
      name,
      subject,
      message,
    });

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error occurred while interacting with the Google Spreadsheet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
