/**
 * Serialize rows to CSV and trigger a browser download. Each cell is quoted and
 * internal quotes are escaped. `rows[0]` is expected to be the header row.
 */
export function exportCsv(filename: string, rows: (string | number)[][]): void {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
