const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const createTransactionReceipt = async (data) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
      Title: 'Transaction Receipt',
      Author: 'SSUET',
    },
  });

  // Output file
  let filePath = path.join(__dirname, '..', 'pdfs', 'Transaction_Recepit.pdf')
  doc.pipe(fs.createWriteStream(filePath));

  // Fonts (using built-in PDFKit fonts; you can use custom fonts if available)
  const headerFont = 'Helvetica-Bold';
  const bodyFont = 'Helvetica';
  const footerFont = 'Helvetica-Oblique';

  // Colors
  const primaryColor = '#2C3E50'; // Dark blue
  const accentColor = '#3498DB'; // Light blue
  const textColor = '#333333'; // Dark gray

  // Helper function to draw a horizontal line
  const drawLine = (y, thickness = 1) => {
    doc
      .strokeColor(accentColor)
      .lineWidth(thickness)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  };

  // Header
  doc
    .font(headerFont)
    .fontSize(24)
    .fillColor(primaryColor)
    .text('SSUET', 50, 40, { align: 'left' })
    .fontSize(14)
    .fillColor(textColor)
    .text('Transaction Receipt', 50, 70, { align: 'left' })
    .fontSize(10)
    .text('123 Business Street, Karachi, Pakistan', 50, 95)
    .text('Email: support@SSUET.com | Phone: +92 123 456 7890', 50, 110);

  // Logo placeholder (uncomment and provide a logo image if available)
  /*
  doc.image('path/to/logo.png', 400, 40, {
    width: 100,
    align: 'right',
  });
  */

  // Line separator
  drawLine(140, 2);

  // Transaction Details Section
  doc
    .font(headerFont)
    .fontSize(16)
    .fillColor(primaryColor)
    .text('Transaction Details', 50, 160)
    .moveDown(0.5);


  // Transaction details in a table-like structure
  const detailsStartY = 190;
  const rowHeight = 20;
  const labelWidth = 150;
  const valueX = 200;

  const details = [
    { label: 'Date:', value: new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) },
    { label: 'Sender Name:', value: data.senderName },
    { label: 'Receiver Name:', value: data.receiverName },
    { label: 'Amount:', value: `$${parseFloat(data.amount).toFixed(2)}` },
  ];

  doc.font(bodyFont).fontSize(12).fillColor(textColor);

  details.forEach((item, index) => {
    const y = detailsStartY + index * rowHeight;
    doc
      .text(item.label, 50, y, { width: labelWidth, align: 'left' })
      .text(item.value, valueX, y, { align: 'left' });
  });

  // Line separator
  drawLine(detailsStartY + details.length * rowHeight + 10);

  // Summary Section
  doc
    .font(headerFont)
    .fontSize(14)
    .fillColor(primaryColor)
    .text('Summary', 50, detailsStartY + details.length * rowHeight + 30)
    .moveDown(0.5)
    .font(bodyFont)
    .fontSize(12)
    .fillColor(textColor)
    .text(`Thank you, ${data.senderName}, for your payment of `, 50, doc.y, { continued: true })
    .fillColor(accentColor)
    .font(headerFont)
    .text(`$${parseFloat(data.amount).toFixed(2)}`, { continued: true })
    .fillColor(textColor)
    .font(bodyFont)
    .text(` to ${data.receiverName}.`)
    .moveDown()
    .text('This transaction has been successfully processed.');

  // Footer
  const footerY = doc.page.height - 100;
  drawLine(footerY - 10);
  doc
    .font(footerFont)
    .fontSize(10)
    .fillColor(textColor)
    .text(
      '© ' + new Date().getFullYear() + ' SSUET. All rights reserved.',
      50,
      footerY,
      { align: 'center' }
    )
    .text(
      'This is an auto-generated receipt for your records. For inquiries, contact support@ssuet.com.',
      50,
      footerY + 20,
      { align: 'center' }
    );

  doc.end();
};

// const data = {
//   senderName: 'John Doe',
//   amount: 100,
//   receiverName: 'Alice Smith',
//   email: 'john.doe@example.com',
// };
// const a = async()=> await createTransactionReceipt(data);
// a()

module.exports = createTransactionReceipt;