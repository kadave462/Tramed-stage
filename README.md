# Pharmacy Sales Intelligence Mini-System

Built for **PHARMACIE TRAMED LTD** using real sales and stock data exported from the Ishyiga POS system.

---

- **Dashboard** — daily KPIs (revenue, cost, gross profit, invoice count)
- **Top 10 Products** — horizontal bar chart of best-selling products by revenue
- **Top 10 Clients** — horizontal bar chart of best clients by revenue
- **Stock Alerts** — flags any product with fewer than 10 units remaining
- **Transaction Table** — full list of today's sales with margin per line item
- **Date Picker** — filter all dashboard data by any date in the dataset
- **Data Upload** — import sales or stock from Excel (.xlsx) — file type detected automatically
- **Data** — sales data and stock data (xls and csv) via the upload page later we will ask for the api. (as promissed)
- **Delete Routes** — clear sales or stock data via the upload page

## Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Runtime      | Node.js                       |
| Framework    | Express                       |
| ORM          | Prisma                        |
| Database     | PostgreSQL                    |
| Frontend     | Vanilla JavaScript, HTML, CSS |
|              | later to React                |
| File Parsing | xlsx (SheetJS)                |
| File Upload  | Multer                        |

## 1. Project Overview

This is a full-stack web application that imports raw pharmacy sales and stock data from Excel files, stores it in a PostgreSQL database, and displays business insights through an interactive dashboard.

The dashboard allows filtering by date range and shows revenue, cost, gross profit, top products, top clients, and stock alerts in real time.

---

## 3. How to Run the Project

```bash
cd tramed_server
npm install
```

Create a `.env` file:

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

Run migrations and start:

```bash
npx prisma migrate dev
node index.js
```

App runs at `http://localhost:3000`

To import data, go to `http://localhost:3000/upload.html` and upload an Excel file.

---

## 4. Database Design

Two tables in PostgreSQL managed via Prisma ORM.

A single-table-per-entity approach was chosen because the source data comes as flat Excel exports from Ishyiga POS. A fully normalized schema with separate Products, Customers, and Suppliers tables would require joining data across files that do not share reliable foreign keys.

### Sale table — one row per product line item sold

| Field           | Type   | Description                                        |
| --------------- | ------ | -------------------------------------------------- |
| id              | Int    | Auto-increment primary key                         |
| invoiceId       | String | Invoice number                                     |
| date            | Date   | Date of sale                                       |
| productCode     | String | Product identifier                                 |
| productName     | String | Product name                                       |
| quantity        | Int    | Quantity sold                                      |
| unitPrice       | Float  | Selling price per unit                             |
| costPrice       | Float  | Purchase price per unit                            |
| totalAmount     | Float  | Total revenue for this line (unitPrice x quantity) |
| clientFirstName | String | Client first name                                  |
| clientLastName  | String | Client last name                                   |
| employe         | String | Employee who made the sale                         |
| societe         | String | insurance compnay name if applicable               |

### Stock table — one row per product in inventory

| Field          | Type            | Description                       |
| -------------- | --------------- | --------------------------------- |
| id             | Int             | Auto-increment primary key        |
| productCode    | String (unique) | Product identifier                |
| productName    | String          | Product name                      |
| supplier       | String          | Supplier name                     |
| batchNumber    | String          | Batch number                      |
| expirationDate | Date            | Product expiration date           |
| qtyStart       | Int             | Stock quantity at start of period |
| qtyLive        | Int             | Current stock level               |
| purchasePrice  | Float           | Purchase price per unit           |

---

## 5. Key Features Implemented

### Data Import

- Upload page where the user selects an Excel (.xlsx) file
- Server automatically detects file type by checking column headers: if `ID_INVOICE` exists it is a Sales file; if `QTY_START` exists it is a Stock file
- Rows with missing productCode, productName, or totalAmount are skipped
- All undefined fields are set to null so missing values are handled
- Duplicate records are skipped using Prisma skipDuplicates
- Success message shows number of rows imported; error message shown on failure

### Dashboard

- KPI cards: Total Revenue, Total Cost, Gross Profit, Invoice Count
- Date Range Picker — filters all data by any range with presets: Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, Custom Range
- Top 10 Products chart — horizontal bar chart ranked by revenue
- Top 10 Clients chart — horizontal bar chart ranked by revenue
- Stock Alerts — flags products with fewer than 10 units, sorted by lowest stock first
- Transaction table — top 100 transactions by revenue for the selected date range

### API Routes

| Method | Route         | Description                     |
| ------ | ------------- | ------------------------------- |
| GET    | `/api/sales`  | Return all sales records        |
| GET    | `/api/stock`  | Return all stock records        |
| POST   | `/api/upload` | Upload and import an Excel file |
| DELETE | `/api/sales`  | Delete all sales records        |
| DELETE | `/api/stock`  | Delete all stock records        |

### Database Queries

Queries are written using Prisma ORM which translates JavaScript into SQL automatically. The following questions are answered by the system:

- **Total revenue** — sum of totalAmount across filtered sales
- **Total profit** — sum of (unitPrice - costPrice) x quantity for each sale
- **Top products** — sales grouped by productName, sorted by total revenue
- **Top clients** — sales grouped by client name, sorted by total revenue
- **Low stock products** — stock filtered where qtyLive is less than 10

The following queries were **not implemented**:

- Top 5 most profitable products — profit per product not calculated separately
- Daily sales totals — no day-by-day breakdown chart
- Revenue by product category — the POS export does not include a category column

---

## 7. Reorder Recommendation Logic

The Stock Alerts section flags every product with fewer than 10 units as a reorder candidate, but needs to be improved with more sofisticated formulas

**What was not implemented:**

The full reorder formula was not built:

```
average_daily_sales      = total_quantity_sold / number_of_days
estimated_days_remaining = current_stock / average_daily_sales
recommended_reorder_qty  = average_daily_sales x 14 - current_stock
Flag for reorder if estimated_days_remaining < 7
```

The columns average_daily_sales, estimated_days_remaining, and recommended_reorder_quantity do not appear in the dashboard.

---

## Project Structure

```
tramed_server/
├── prisma/
│   └── schema.prisma       # Sale and Stock models
├── public/
│   ├── index.html          # Dashboard
│   ├── dashboard.js        # Dashboard logic
│   ├── upload.html         # Upload + delete page
│   └── style.css
├── index.js                # Express server + all API routes
├── .env                    # DATABASE_URL (not committed)
└── package.json
```
