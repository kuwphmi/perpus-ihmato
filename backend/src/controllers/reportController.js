import PDFDocument from "pdfkit";

export const generateReport = (req, res) => {
  const { month } = req.query;

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=laporan-${month}.pdf`);

  doc.pipe(res);

  doc.fontSize(18).text(`Laporan Bulan ${month}`);
  doc.moveDown();
  doc.text("Data laporan di sini...");

  doc.end();
};