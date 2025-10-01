export function toCsv(rows) {
  if (!rows || rows.length === 0) {
    return "";
  }
  const header = Object.keys(rows[0]);
  const escape = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value).replace(/"/g, '""');
    if (stringValue.search(/[",\n]/g) >= 0) {
      return `"${stringValue}"`;
    }
    return stringValue;
  };
  const csvLines = [header.join(",")];
  for (const row of rows) {
    csvLines.push(header.map((key) => escape(row[key])).join(","));
  }
  return csvLines.join("\n");
}

export function downloadCsv(filename, rows) {
  const csvString = toCsv(rows);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
