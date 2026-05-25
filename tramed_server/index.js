const express = require("express");
const app = express();

const multer = require("multer");
const xlsx = require("xlsx");

const upload = multer({ storage: multer.memoryStorage() });
const SALES_MAPPING = {
  "INVOICE ID": "invoiceId",
  DATE: "date",
  "PRODUCT CODE": "productCode",
  "PRODUCT NAME": "productName",
  QUANTITY: "quantity",
  PRICE: "unitPrice",
  "COST PRICE": "costPrice",
  TOTAL: "totalAmount",
  "TOTAL COST": "totalCost",
};

const STOCK_MAPPING = {
  CODE: "productCode",
  DESIGNATION: "productName",
  SUPPLIER: "supplier",
  BATCH: "batchNumber",
  "EXPIRATION DATE": "expirationDate",
  QTY_START: "qtyStart",
  QTY_LIVE: "qtyLive",
  "PURCHASE PRICE": "purchasePrice",
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static("public"));

app.get("/api/sales", async function (req, res) {
  const sales = await prisma.sale.findMany();
  console.log("Someone visited  http://localhost:3000/api/sales");

  res.json(sales);
});

function parseExcelDate(serial) {
  if (serial instanceof Date) return serial;
  return new Date(Math.round((serial - 25569) * 86400 * 1000));
}

function parseExpiry(ddmmyy) {
  const str = String(ddmmyy).padStart(6, "0");
  const day = str.slice(0, 2);
  const month = str.slice(2, 4);
  const year = "20" + str.slice(4, 6);
  return new Date(`${year}-${month}-${day}`);
}
app.post("/api/upload", upload.single("file"), async function (req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    console.log("file uploadeded");

    // file exists — now do the work:
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    console.log("First row:", rows[0]);

    const headers = Object.keys(rows[0]);
    console.log("headers:", headers);
    const fileType = headers.includes("ID_INVOICE")
      ? "Sales"
      : headers.includes("QTY_START")
        ? "Stock"
        : null;
    res.status(200).json({ message: "fine" });
    console.log("fileType:", fileType);
    if (!fileType) return res.status(400).json({ error: "Unknown file type" });
    const mapping = fileType === "Sales" ? SALES_MAPPING : STOCK_MAPPING;
    const records = [];
    for (const row of rows) {
      const record = {};
      for (const csvColumn of Object.keys(mapping)) {
        const dbField = mapping[csvColumn];
      }
      records.push(record);
    }
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});
