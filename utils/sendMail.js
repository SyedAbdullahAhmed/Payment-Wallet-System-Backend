const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html, attachments }) => {
  try {
    if (process.env.EMAIL_ENV === "development") {
      // Create a transporter using MailHog SMTP
      let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false, // No SSL
        auth: null     // MailHog doesn’t require auth
      });

      // Email options
      let info = await transporter.sendMail({
        from: '"Test Sender" <sender@example.com>',
        to,
        subject,
        html,
        attachments
      });

      console.log(`Message sent: ${info.messageId}`);
      return info.messageId ? true : false;;
    }
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

    const opt = {
      from: config.username,
      to: to?.email || to ,
      subject,
      html,
      ...(attachments ? { attachments } : {}) // include only if truthy
    }

    console.log(opt)
    const info = await transporter.sendMail(opt);

    console.log("✅ Email sent:", info.messageId);


    return info.messageId ? true : false;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};


module.exports = sendMail;

