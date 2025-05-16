const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log("dome")
      const config = {
      username: process.env.SENDER_EMAIL,
      password: process.env.PASSWORD,
      smtpServer: process.env.SMTPSERVER,
      smtpPort: Number(process.env.SMTPPORT),
      imapServer: process.env.IMAPSERVER,
      imapPort: process.env.IMAPPORT,
      pop3Port: process.env.POP3PORT,
    };

    const transporter = nodemailer.createTransport({
      host: config.smtpServer,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
    const info = await transporter.sendMail({
      from: config.username,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);


    return info.messageId ? true : false;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};


module.exports = sendMail;