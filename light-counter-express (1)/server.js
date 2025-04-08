const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const path = require("path");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

const credentials = require("./credentials.json");
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Sheet1";

app.post("/send-to-sheet", async (req, res) => {
  try {
    const { timestamp, material } = req.body;
    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:B`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[timestamp, material]] },
    });

    res.send({ success: true });
  } catch (error) {
    console.error("שגיאה בשליחה ל-Google Sheets:", error);
    res.status(500).send({ error: "שליחה נכשלה" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("השרת פעיל על פורט", PORT);
});
