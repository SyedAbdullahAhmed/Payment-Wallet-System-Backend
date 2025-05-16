const nodemailer = require("nodemailer");
const asyncHandler = require('../utils/asyncHandler');

const sendMail = asyncHandler(async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  console.log("✅ Email sent:", info.messageId);


  return info.messageId ? true : false;
});


module.exports = sendMail;