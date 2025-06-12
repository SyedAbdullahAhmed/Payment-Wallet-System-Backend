
const Transaction = require('../schema/Transaction');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const Keys = require('../schema/Keys');
const User = require('../schema/User');
const crypto = require('crypto')

const getNotifications = asyncHandler(async (req, res) => {

  const user = req.user;
  // console.log(user._id);
  // const id = new mongoose.Types.ObjectId(`${user._id}`);


  // const transactions = await Transaction.find({
  //   $or: [
  //     { userId: new mongoose.Types.ObjectId(`${id}`) },
  //     { referenceId: new mongoose.Types.ObjectId(`${id}`) }
  //   ]
  // });

  // let transactionTransformed = [];
  // for (let i = 0; i < transactions.length; i++) {
  //   if ((transactions[i].userId).toString() === (user._id).toString()) {
  //     console.log("al")
  //     let obj = {};
  //     obj.senderName = transactions[i].senderName;
  //     obj.receiverName = transactions[i].receiverName;
  //     obj.amount = transactions[i].amount;
  //     obj.date = transactions[i].createdAt;
  //     obj.type = 'sent';
  //     const isoString = transactions[i].createdAt;
  //     const date = new Date(isoString);
  //     const hours = date.getUTCHours().toString().padStart(2, '0');
  //     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  //     obj.time = `${hours}:${minutes}`;
  //     transactionTransformed.push(obj);
  //   }
  //   else if ((transactions[i].referenceId).toString() === (user._id).toString()) {
  //     let obj = {};
  //     obj.senderName = transactions[i].senderName;
  //     obj.receiverName = transactions[i].receiverName;
  //     obj.amount = transactions[i].amount;
  //     obj.date = transactions[i].createdAt;
  //     obj.type = 'received';
  //     const isoString = transactions[i].createdAt;
  //     const date = new Date(isoString);
  //     const hours = date.getUTCHours().toString().padStart(2, '0');
  //     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  //     obj.time = `${hours}:${minutes}`;
  //     transactionTransformed.push(obj);
  //   }
  // }

  // console.log(transactions)
  // console.log(transactionTransformed)

  let transactions = await Transaction.find({}).lean();

  for (const e of transactions) {
    try {
      let encryptedBuffer = Buffer.from(e.encryptedData, 'base64');

      let keyDoc = await Keys.findOne({ userId: e.referenceId }).select("privateKey");
      let senderName = await User.findOne({ _id: e.userId });
      let receiverName = await User.findOne({ _id: e.referenceId })

      e.senderName = senderName?.name;
      e.receiverName = receiverName?.name;

      if (!keyDoc) {
        console.warn(`No key found for referenceId: ${e.referenceId}`);
        continue;
      }

      let privateKeyPem = Buffer.from(keyDoc.privateKey, 'base64').toString('utf-8');

      let decryptedBuffer = crypto.privateDecrypt(
        {
          key: privateKeyPem,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        encryptedBuffer
      );

      let decryptedString = decryptedBuffer.toString('utf8');

      e.amount = JSON.parse(decryptedString)?.amount;

      // Add type
      const currentUserId = req.user?._id?.toString();
      e.type = (e.userId.toString() === currentUserId) ? 'send' : 'received';

      // Add time
      const createdDate = new Date(e.createdAt);
      const hours = createdDate.getUTCHours().toString().padStart(2, '0');
      const minutes = createdDate.getUTCMinutes().toString().padStart(2, '0');
      e.time = `${hours}:${minutes}`;


      console.log(`Decrypted for ${e.referenceId}:`, decryptedString);

    } catch (error) {
      console.error(`Error decrypting for referenceId: ${e.referenceId}`, error.message);
    }
  }

  console.log("Finished decrypting all transactions.");

  console.log(transactions)

  const userId = req.user._id.toString();
  console.log(userId)

 transactions = transactions.filter(doc =>
  doc.userId.toString() === userId || doc.referenceId.toString() === userId
);



  return res.status(200).json(
    new ApiResponse(
      200,
      { transactionTransformed: transactions },
      'Notifications fetched successfully.'
    )
  );
  // return res.status(200).json(
  //   new ApiResponse(
  //     200,
  //     { transactionTransformed },
  //     'Notifications fetched successfully.'
  //   )
  // );
});



module.exports = {
  getNotifications
};

// - encrypted - to buffer
// - get private key from ref id keys table
// - decrppt the data
// - return
// {
//     senderId: user?._id,
//     receiverId: receiverId.userId,
//     senderName: senderName.name,
//     receiverName: receiverName.name,
//     amount: amount,
//     status: 'success',
//   }
// - convert to
// {
//     senderName: 'qwdwed',
//     receiverName: 'Tom Kroos',
//     amount: 1,
//     date: 2025-06-11T19:47:34.856Z,
//     type: 'sent',
//     time: '19:47'
// }

