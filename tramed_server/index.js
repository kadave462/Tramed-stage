require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
  debug: true,
});
const express = require("express");
const app = express();

const multer = require("multer");
const xlsx = require("xlsx");

const upload = multer({ storage: multer.memoryStorage() });
const SALES_MAPPING = {
  ID_INVOICE: "invoiceId",
  DATE: "date",
  CODE: "productCode",
  NAME_PRODUCT: "productName",
  QUANTITE: "quantity",
  PRICE: "unitPrice",
  PRICE_REVIENT: "costPrice",
  TOTAL: "totalAmount",
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

app.get("/api/stock", async function (req, res) {
  const stock = await prisma.stock.findMany();
  res.json(stock);
});

function parseExcelDate(serial) {
  if (serial instanceof Date) return serial;
  return new Date(Math.round((serial - 25569) * 86400 * 1000));
}

function parseExpiry(ddmmyy) {
  if (!ddmmyy) return null;
  const str = String(ddmmyy).replace(/\//g, "").padStart(6, "0");
  const day = str.slice(0, 2);
  const month = str.slice(2, 4);
  const year = "20" + str.slice(4, 6);
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date) ? null : date;
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
    console.log("fileType:", fileType);
    if (!fileType) return res.status(400).json({ error: "Unknown file type" });
    const mapping = fileType === "Sales" ? SALES_MAPPING : STOCK_MAPPING;
    const records = [];
    for (const row of rows) {
      const record = {};
      for (const csvColumn of Object.keys(mapping)) {
        const dbField = mapping[csvColumn];
        record[dbField] = row[csvColumn];
      }

      if (fileType === "Sales") {
        record.date = parseExpiry(row["DATE"]);
      } else {
        record.expirationDate = parseExpiry(row["EXPIRATION DATE"]);
      }
      for (const key of Object.keys(record)) {
        if (record[key] === undefined) record[key] = null;
      }
      if (!record.productCode) continue;
      records.push(record);
    }
    if (fileType === "Sales") {
      await prisma.sale.createMany({ data: records, skipDuplicates: true });
    } else {
      await prisma.stock.createMany({ data: records, skipDuplicates: true });
    }
    res.json({ fileType, rowsImported: records.length });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/sales", async function (req, res) {
  try {
    await prisma.sale.deleteMany();
    res.json({ message: "All sales deleted" });
    console.log("deleted");
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/stock", async function (req, res) {
  try {
    await prisma.stock.deleteMany();
    res.json({ message: "All stock deleted" });
    console.log("deleted");
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});
