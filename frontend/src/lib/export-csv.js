export function exportToCSV(data, filename = "export.csv") {
  if (!data || !data.length) return;
  const csvRows = [];
  // En-têtes
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  // Lignes
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] ?? "";
      // Échapper les guillemets
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
} 