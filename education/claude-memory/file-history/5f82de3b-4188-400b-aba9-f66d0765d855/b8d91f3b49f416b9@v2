---
name: example-sales-table
description: "Teaching example of a 3-row sales CSV and how it maps to the Sale database table — used to explain rowsImported, rows vs headers, and CSV-to-database flow"
metadata: 
  node_type: memory
  type: project
  originSessionId: d6b7d3a0-d853-469d-8b85-e9af302c95a5
---

Teaching example used to explain file upload flow, rows, and rowsImported.

**The CSV file (sales.csv):**
```
id, product, price, quantity
1, Paracetamol, 500, 10
2, Amoxicillin, 1200, 5
3, Ibuprofen, 800, 8
```
First line = header (not a row). Lines 2-4 = 3 data rows.

**After upload, Sale table in database:**
```
id | product      | price | quantity
1  | Paracetamol  | 500   | 10
2  | Amoxicillin  | 1200  | 5
3  | Ibuprofen    | 800   | 8
```

**Server sends back:** `{ fileType: 'Sales', rowsImported: 3 }`

`rowsImported: 3` = 3 CSV data rows successfully saved to database.

**Why:** User was confused about what "rows" means and what `rowsImported` counts. This example clarified it.

**How to apply:** Reference this example when explaining the upload route, Prisma saves, or rowsImported logic.
