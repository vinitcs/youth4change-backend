import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async ({ name, stage, date, remark }) => {
  const templatePath = path.resolve(__dirname, 'certificateTemplate.pdf');
  const outputDir = path.resolve('./public/uploads/certificates');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  const outputPath = path.join(outputDir, fileName);

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  firstPage.drawText(name, { x: 260, y: 480, size: 40, font, color: rgb(0, 0, 0) });
  firstPage.drawText(stage, { x: 280, y: 320, size: 30, font, color: rgb(0.1, 0.1, 0.1) });
  firstPage.drawText(date, { x: 200, y: 110, size: 22, font, color: rgb(0.1, 0.1, 0.1) });
  firstPage.drawText(remark, { x: 180, y: 250, size: 24, font, color: rgb(0.2, 0.2, 0.2) });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  // ✅ Return public-facing path
  const publicUrl = `/uploads/certificates/${fileName}`;
  return publicUrl;
};


