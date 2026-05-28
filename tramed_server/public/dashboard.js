async function loadDashboard() {
  const sales = await (await fetch("/api/sales")).json();
  const stock = await (await fetch("/api/stock")).json();

  console.log("sales loaded:", sales.length);
  console.log("stock loaded:", stock.length);
  console.log("First stock row:", stock[0]);

  //   the most recent date in the data
  const latestDate = sales
    .map((sale) => sale.date.slice(0, 10))
    .sort()
    .at(-1);

  console.log("Latest date:", latestDate);

  // keep only sales from that date
  const todaySales = sales.filter((sale) => {
    return sale.date.slice(0, 10) === latestDate;
  });

  console.log("Sales on latest date:", todaySales.length);

  // add up totals
  let totalRevenue = 0;
  let totalCost = 0;

  todaySales.forEach((sale) => {
    totalRevenue += sale.totalAmount ?? 0;
    totalCost += (sale.costPrice ?? 0) * (sale.quantity ?? 0);
  });

  document.getElementById("kpiRevenue").textContent =
    Math.round(totalRevenue).toLocaleString("fr-RW");
  document.getElementById("kpiCost").textContent =
    Math.round(totalCost).toLocaleString("fr-RW");
  document.getElementById("kpiProfit").textContent = Math.round(
    totalRevenue - totalCost,
  ).toLocaleString("fr-RW");

  // for invoices, we want to count unique invoice IDs, not line items
  const invoiceIds = new Set(todaySales.map((sale) => sale.invoiceId));
  document.getElementById("kpiInvoices").textContent = invoiceIds.size;
  document.getElementById("kpiItems").textContent =
    todaySales.length + " line items";
  document.getElementById("txnCount").textContent = todaySales.length;

  console.log("Total Revenue:", totalRevenue);
  console.log("Total Cost:", totalCost);

  const tbody = document.getElementById("txnBody");
  todaySales.forEach((sale) => {
    const row = `
      <tr>
        <td>${sale.invoiceId}</td>
        <td>${sale.date.slice(0, 10)}</td>
        <td>${sale.productName}</td>
        <td>${sale.quantity}</td>
        <td>${Math.round(sale.unitPrice).toLocaleString("fr-RW")} RWF</td>
        <td>${Math.round(sale.totalAmount).toLocaleString("fr-RW")} RWF</td>
        <td>${Math.round((sale.costPrice ?? 0) * (sale.quantity ?? 0)).toLocaleString("fr-RW")} RWF</td>
        <td>${Math.round(sale.totalAmount - (sale.costPrice ?? 0) * (sale.quantity ?? 0)).toLocaleString("fr-RW")} RWF</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  //stock alerts

  const alertContainer = document.getElementById("stockAlerts");
  const lowStock = stock
    .filter((item) => (item.qtyLive ?? 0) < 10)
    .sort((a, b) => a.qtyLive - b.qtyLive);

  if (lowStock.length === 0) {
    alertContainer.innerHTML =
      "<p style='color:#198754;'>All stock levels OK</p>";
  } else {
    for (const item of lowStock) {
      alertContainer.innerHTML += `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <div>
            <div style="font-weight:500;">${item.productName}</div>
            <div style="font-size:.75rem;color:#6c757d;">${item.supplier}</div>
          </div>
          <div style="color:#dc3545;font-weight:600;">${item.qtyLive} left</div>
        </div>
      `;
    }
  }

  // ── Top Products chart ──────────────────────────────────

  const revenueByProduct = {};
  for (const sale of todaySales) {
    const name = sale.productName;
    revenueByProduct[name] = (revenueByProduct[name] || 0) + sale.totalAmount;
  }
  const sorted = Object.entries(revenueByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  new Chart(document.getElementById("chartTopProducts"), {
    type: "bar",
    data: {
      labels: sorted.map((x) => x[0]),
      datasets: [
        {
          label: "Revenue (RWF)",
          data: sorted.map((x) => x[1]),
          backgroundColor: "#1a7a4a",
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: true } },
      scales: {
        x: { beginAtZero: true },
      },
    },
  });

  // ── clients chart ──────────────────────────────────
  const byHour = Array(24).fill(0);
  for (const sale of todaySales) {
    byHour[new Date(sale.date).getHours()] += sale.totalAmount ?? 0;
  }
  new Chart(document.getElementById("chartHourly"), {
    type: "bar",
    data: {
      labels: byHour.map((_, i) => i + "h"),
      datasets: [
        { label: "Revenue", data: byHour, backgroundColor: "#f0a500" },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  // ── Top Clients chart ──────────────────────────────────
  const revenueByClient = {};
  for (const sale of todaySales) {
    const name = (
      (sale.clientFirstName ?? "") +
      " " +
      (sale.clientLastName ?? "")
    ).trim();
    if (!name) continue;
    revenueByClient[name] =
      (revenueByClient[name] || 0) + (sale.totalAmount ?? 0);
  }
  const topClients = Object.entries(revenueByClient)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  new Chart(document.getElementById("chartTopClients"), {
    type: "bar",
    data: {
      labels: topClients.map((x) => x[0]),
      datasets: [
        {
          label: "Revenue (RWF)",
          data: topClients.map((x) => x[1]),
          backgroundColor: "#f0a500",
        },
      ],
    },
    options: { indexAxis: "y", plugins: { legend: { display: false } } },
  });
}

loadDashboard();
