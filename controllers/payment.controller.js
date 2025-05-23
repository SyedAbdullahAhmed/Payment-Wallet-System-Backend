const Card = require('../schema/CardInfo');
const Keys = require('../schema/Keys');
const User = require('../schema/User');
const Transaction = require('../schema/Transaction');
const crypto = require('crypto')
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendMail = require('../utils/sendMail');

function toPemFormat(rawKey) {
  // Remove header/footer and whitespace
  const base64Body = rawKey
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s+/g, '');

  // Insert line breaks every 64 characters
  const formattedBody = base64Body.match(/.{1,64}/g).join('\n');

  // Rebuild PEM
  return `-----BEGIN PUBLIC KEY-----\n${formattedBody}\n-----END PUBLIC KEY-----\n`;
}




const sendPayment = asyncHandler(async (req, res) => {

  let { receiverPublicKey, amount } = req.body;
  const user = req.user;


  const pemFormatKey = toPemFormat(receiverPublicKey)
  const receiverId = await Keys.findOne({ publicKey: pemFormatKey }).select('userId');

  // console.log('Sender ID:', senderId.userId);
  console.log('Receiver ID:', receiverId.userId);

  if (!receiverId.userId) {
    console.error('User not found');
    throw new ApiError(404, 'User not found');
  }

  const senderName = await User.findOne({ _id: user?._id }).select('name email');
  const receiverName = await User.findOne({ _id: receiverId.userId }).select('name email');

  console.log('Sender Name:', senderName);
  console.log('Receiver Name:', receiverName);

  if (!senderName || !receiverName) {
    console.error('User name not found');
    throw new ApiError(404, 'User not found');
  }


  const dataToEncrypt = {
    senderName: senderName.name,
    receiverName: receiverName.name,
    amount: amount,
    status: 'success',
  }

  console.log('Data to encrypt:', dataToEncrypt);

  const encrypted = crypto.publicEncrypt(pemFormatKey, Buffer.from(JSON.stringify(dataToEncrypt)));
  console.log("\n🔐 Encrypted (base64):", encrypted.toString('base64'));




  amount = Number(amount);

  if (isNaN(amount) || amount <= 0) {
    console.error('Invalid amount:', amount);
    throw new ApiError(400, 'Invalid amount provided');
  }

  const totalAmountOfSender = await User.findOne({ _id: user?._id }).select('totalBalance');
  if (totalAmountOfSender?.totalBalance == null) {
    console.error('Sender totalBalance not found');
    throw new ApiError(500, 'Transaction failed');
  }

  const senderBalance = Number(totalAmountOfSender.totalBalance);
  if (isNaN(senderBalance)) {
    console.error('Invalid sender balance:', totalAmountOfSender.totalBalance);
    throw new ApiError(500, 'Invalid sender balance');
  }

  if (senderBalance < amount) {
    console.warn('Insufficient funds');
    throw new ApiError(400, 'Insufficient funds');
  }

  const newAmountSender = senderBalance - amount;
  totalAmountOfSender.totalBalance = newAmountSender;
  await totalAmountOfSender.save();

  console.log(`Sender new balance: ${newAmountSender}`);

  const totalAmountOfReceiver = await User.findOne({ _id: receiverId.userId }).select('totalBalance');
  if (totalAmountOfReceiver?.totalBalance == null) {
    console.error('Receiver totalBalance not found');
    throw new ApiError(500, 'Transaction failed');
  }

  const receiverBalance = Number(totalAmountOfReceiver.totalBalance);
  if (isNaN(receiverBalance)) {
    console.error('Invalid receiver balance:', totalAmountOfReceiver.totalBalance);
    throw new ApiError(500, 'Invalid receiver balance');
  }

  const newAmountReceiver = receiverBalance + amount;
  totalAmountOfReceiver.totalBalance = newAmountReceiver;
  await totalAmountOfReceiver.save();

  console.log(`Receiver new balance: ${newAmountReceiver}`);

  const transaction = await Transaction.create({
    encryptedData: encrypted.toString('base64'),
    userId: user?._id,
    referenceId: receiverId.userId,
    senderName: senderName.name,
    receiverName: receiverName.name,
    amount: amount,
    status: 'success',
  });

  console.log('Transaction created:', transaction);

  if (!transaction) {
    console.error('Transaction creation failed');
    throw new ApiError(500, 'Transaction failed');
  }

  const details = {
    senderName: senderName.name,
    receiverName: receiverName.name,
    amount: amount,
  };

  // Sender mail (confirmation of payment sent)
  const senderMailOptions = {
    to: senderName.email,
    subject: 'Payment Sent Successfully',
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Payment Sent Successfully</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style type="text/css">
    /* ----- CLIENT-SPECIFIC STYLES ----- */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* ----- GENERAL STYLES ----- */
    body {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f7f6; /* Light grey background for the email body */
      color: #333333;
      line-height: 1.6;
      font-size: 16px;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f7f6;
      padding: 40px 0;
    }
    .content-table {
      width: 100%;
      max-width: 600px; /* Standard width for email content */
      margin: 0 auto;
      background-color: #ffffff; /* White background for the content card */
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden; /* Ensures border-radius applies to child elements like header */
    }
    .header {
      background-color: #4A90E2; /* A nice blue for the header */
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      /* If using a logo image:
      <img src="YOUR_LOGO_URL_HERE" alt="Your Company Name" width="150" style="display:block; margin: 0 auto;">
      Then remove the h1.
      */
    }
    .body-content {
      padding: 30px 40px; /* More padding for content */
    }
    .body-content p {
      margin-bottom: 20px;
    }
    .highlight {
      color: #27ae60; /* Green for successful amount */
      font-weight: 700;
    }
    .recipient-name {
      color: #4A90E2; /* Blue for recipient name */
      font-weight: 500;
    }
    .transaction-details {
      background-color: #eaf0f6; /* Light blueish grey for a subtle details box */
      padding: 15px;
      border-radius: 5px;
      margin: 25px 0;
      font-size: 14px;
    }
    .transaction-details p {
      margin: 5px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #E85A4F; /* A contrasting warm color for CTA */
      color: #ffffff;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 500;
      font-size: 16px;
      margin-top: 10px;
    }
    .footer {
      background-color: #ecf0f1; /* Lighter grey for footer */
      color: #7f8c8d; /* Muted text color for footer */
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #dde2e7;
    }
    .footer a {
      color: #7f8c8d;
      text-decoration: underline;
    }

    /* Responsive Styles (Limited support, but good practice) */
    @media screen and (max-width: 600px) {
      .content-table {
        width: 95% !important;
        max-width: 95% !important;
      }
      .body-content {
        padding: 20px !important;
      }
      .header {
        padding: 20px !important;
      }
      .header h1 {
        font-size: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f7f6;">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
    <tr>
      <td>
  <![endif]-->
  <div class="wrapper">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="content-table">
      <!-- Header -->
      <tr>
        <td class="header">
          <h1>Welcome to our platform!</h1>
          <!-- Or <img src="your-logo-url.png" alt="Your Company Name" width="150"> -->
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td class="body-content">
          <h2 style="color: #333333; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Payment Sent Successfully!</h2>
          <p>Hi ${details.senderName},</p>
          <p>You've successfully sent a payment of <strong class="highlight">$${details.amount}</strong> to <strong class="recipient-name">${details.receiverName}</strong>.</p>

          <div class="transaction-details">
            <p><strong>Transaction Summary:</strong></p>
            <p>Amount: $${details.amount}</p>
            <p>Recipient: ${details.receiverName}</p>
            <!-- You might want to add a transaction ID here if available -->
            <!-- <p>Transaction ID: XXXXXXXX-XXXX-XXXX</p> -->
          </div>

    
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
          <p>Karachi, Pakistan</p>
        </td>
      </tr>
    </table>
  </div>
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>
  `,
  };

  // Receiver mail (confirmation of payment received)
  const receiverMailOptions = {
    to: receiverName.email,
    subject: 'Payment Received',
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You've Received a Payment!</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style type="text/css">
    /* ----- CLIENT-SPECIFIC STYLES ----- */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* ----- GENERAL STYLES ----- */
    body {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f7f6;
      color: #333333;
      line-height: 1.6;
      font-size: 16px;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f7f6;
      padding: 40px 0;
    }
    .content-table {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #27AE60; /* Green for received payment, positive tone */
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .body-content {
      padding: 30px 40px;
    }
    .body-content p {
      margin-bottom: 20px;
    }
    .highlight {
      color: #27ae60; /* Green for received amount */
      font-weight: 700;
    }
    .sender-name {
      color: #4A90E2; /* Blue for sender name */
      font-weight: 500;
    }
    .transaction-details {
      background-color: #e8f5e9; /* Light green for details box */
      padding: 15px;
      border-radius: 5px;
      margin: 25px 0;
      font-size: 14px;
    }
    .transaction-details p {
      margin: 5px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #4A90E2; /* Blue for primary action */
      color: #ffffff;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 500;
      font-size: 16px;
      margin-top: 10px;
    }
    .footer {
      background-color: #ecf0f1;
      color: #7f8c8d;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #dde2e7;
    }
    .footer a {
      color: #7f8c8d;
      text-decoration: underline;
    }

    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      .content-table {
        width: 95% !important;
        max-width: 95% !important;
      }
      .body-content {
        padding: 20px !important;
      }
      .header {
        padding: 20px !important;
      }
      .header h1 {
        font-size: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f7f6;">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6;">
    <tr>
      <td>
  <![endif]-->
  <div class="wrapper">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="content-table">
      <!-- Header -->
      <tr>
        <td class="header">
          <h1>You've Received a Payment!</h1>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td class="body-content">
          <h2 style="color: #333333; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Great News!</h2>
          <p>Hi ${details.receiverName},</p>
          <p>You have received a payment of <strong class="highlight">$${details.amount}</strong> from <strong class="sender-name">${details.senderName}</strong>.</p>

          <div class="transaction-details">
            <p><strong>Payment Details:</strong></p>
            <p>Amount Received: $${details.amount}</p>
            <p>Sent From: ${details.senderName}</p>
            <!-- <p>Transaction ID: XXXXXXXX-XXXX-XXXX</p> -->
          </div>

          <p>The funds should now be reflected in your account. Please check your account balance for more details.</p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>Karachi, Pakistan</p>
        </td>
      </tr>
    </table>
  </div>
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>
  `,
  };

  const isEmailSentSender = await sendMail(senderMailOptions);
  const isEmailSentReceiver = await sendMail(receiverMailOptions);

  if (!isEmailSentSender) {
    console.log("Failed to send mail to sender")
    throw new ApiError(500, 'Failed to send mail to sender');
  }
  if (!isEmailSentReceiver) {
    console.log("Failed to send mail to receiver")
    throw new ApiError(500, 'Failed to send mail to receiver');
  }


  return res
    .status(200)
    .json(new ApiResponse(200, { transaction }, 'Transaction successful.'));
});

module.exports = {
  sendPayment
};


// get senderPrivate and receivePublic and amount
// find sender and receiver in db
// now 2 users id
// find both users
// get name
// create transaction
// encrypt data using senderPrivate and receiverPublic
// save encrypt data also include sendername and payment status and amount in transaction
// add total amount to sender


// dencrypt data using receiverPrivate and senderPublic

// ZCsHwp1BrbiYa3EcswkwUjUKV+B++Yc8BVkaUQJorKLXRD+sF8qljWSsJE0huxbq06ZdgM3MhhNZmjhlW97Z3g==
