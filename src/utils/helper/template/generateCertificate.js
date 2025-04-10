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

  firstPage.drawText(name, { x: 600, y: 380, size: 40, font, color: rgb(0, 0, 0) });
  firstPage.drawText(stage, { x: 680, y: 720, size: 38, font, color: rgb(0, 0, 0)  }); // at top display 
  firstPage.drawText(stage, { x: 956, y: 338, size: 16, font, color: rgb(0, 0, 0)  }); // at remark
  // firstPage.drawText(date, { x: 200, y: 110, size: 22, font, color: rgb(0, 0, 0)  });
  // firstPage.drawText(remark, { x: 180, y: 250, size: 24, font, color: rgb(0, 0, 0)  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  // ✅ Return public-facing path
  const publicUrl = `/uploads/certificates/${fileName}`;
  return publicUrl;
};


