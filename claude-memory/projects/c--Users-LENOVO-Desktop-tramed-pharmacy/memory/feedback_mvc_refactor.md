---
name: feedback-mvc-refactor
description: Refactor index.js into MVC structure after core features are working
metadata: 
  node_type: memory
  type: project
  originSessionId: d6b7d3a0-d853-469d-8b85-e9af302c95a5
---

After upload, sales, and stock routes are all working in index.js, refactor into a proper MVC folder structure:

```
routes/        → upload.js, sales.js, stock.js
controllers/   → uploadController.js
repositories/  → saleRepository.js, stockRepository.js
public/        → HTML files (views)
```

**Why:** User asked for this specifically. Good software engineering principle — make it work first, then make it clean.

**How to apply:** When core features are done, remind the user we planned to do this and teach the full MVC pattern at that point.
