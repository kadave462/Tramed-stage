let chartTopProductsInstance = null;
let chartTopClientsInstance = null;

async function loadDashboard() {
  const sales = await (await fetch("/api/sales")).json();
  const stock = await (await fetch("/api/stock")).json();

  const dates = sales.map((s) => s.date.slice(0, 10)).sort();
  const earliestDate = dates.at(0);
  const latestDate = dates.at(-1);

  $("#datePicker").daterangepicker({
    startDate: moment(earliestDate),
    endDate: moment(latestDate),
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "Last 7 Days": [moment().subtract(6, "days"), moment()],
      "Last 30 Days": [moment().subtract(29, "days"), moment()],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      "Last Month": [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    },
    locale: { format: "MMM D, YYYY" },
  });

  renderForRange(sales, stock, earliestDate, latestDate);

  document.getElementById("searchBtn").addEventListener("click", () => {
    const picker = $("#datePicker").data("daterangepicker");
    const start = picker.startDate.format("YYYY-MM-DD");
    const end = picker.endDate.format("YYYY-MM-DD");
    renderForRange(sales, stock, start, end);
  });
}

function renderForRange(sales, stock, startDate, endDate) {
  const filtered = sales.filter((s) => {
    const d = s.date.slice(0, 10);
    return d >= startDate && d <= endDate;
  });

  let totalRevenue = 0;
  let totalCost = 0;

  filtered.forEach((sale) => {
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

  const invoiceIds = new Set(filtered.map((sale) => sale.invoiceId));
  document.getElementById("kpiInvoices").textContent = invoiceIds.size;
  document.getElementById("kpiItems").textContent =
    filtered.length + " line items";
  document.getElementById("txnCount").textContent = filtered.length;

  const tbody = document.getElementById("txnBody");
  let rows = "";
  filtered
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 100)
    .forEach((sale) => {
      rows += `
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
    });
  tbody.innerHTML = rows;

  const alertContainer = document.getElementById("stockAlerts");
  alertContainer.innerHTML = "";
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

  if (chartTopProductsInstance) chartTopProductsInstance.destroy();
  if (chartTopClientsInstance) chartTopClientsInstance.destroy();

  const revenueByProduct = {};
  for (const sale of filtered) {
    revenueByProduct[sale.productName] =
      (revenueByProduct[sale.productName] || 0) + sale.totalAmount;
  }
  const sorted = Object.entries(revenueByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  chartTopProductsInstance = new Chart(
    document.getElementById("chartTopProducts"),
    {
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
        scales: { x: { beginAtZero: true } },
      },
    },
  );

  const revenueByClient = {};
  for (const sale of filtered) {
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

  chartTopClientsInstance = new Chart(
    document.getElementById("chartTopClients"),
    {
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
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
      },
    },
  );
}

loadDashboard();
