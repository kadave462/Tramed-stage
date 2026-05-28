# Tramed Pharmacy — Management System

A full-stack pharmacy management web app built for **PHARMACIE TRAMED LTD**.

## Features

- **Dashboard** — daily KPIs (revenue, cost, gross profit, invoice count)
- **Top 10 Products** — horizontal bar chart of best-selling products by revenue
- **Top 10 Clients** — horizontal bar chart of best clients by revenue
- **Stock Alerts** — flags any product with fewer than 10 units remaining
- **Transaction Table** — full list of today's sales with margin per line item
- **Date Picker** — filter all dashboard data by any date in the dataset
- **Data Upload** — import sales or stock from Excel (.xlsx) — file type detected automatically
- **Delete Routes** — clear sales or stock data via the upload page

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Frontend | Vanilla JavaScript, HTML, CSS |
| Charts | Chart.js 4 |
| UI | Bootstrap 5 |
| File Parsing | xlsx (SheetJS) |
| File Upload | Multer |

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

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/sales` | Return all sales |
| GET | `/api/stock` | Return all stock |
| POST | `/api/upload` | Upload and import Excel file |
| DELETE | `/api/sales` | Delete all sales |
| DELETE | `/api/stock` | Delete all stock |

## Getting Started

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

## Data Format

The upload route auto-detects file type by checking column headers:
- **Sales file** — must contain `ID_INVOICE` column
- **Stock file** — must contain `QTY_START` column
