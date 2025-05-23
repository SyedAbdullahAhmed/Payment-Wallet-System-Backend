
const Transaction = require('../schema/Transaction');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const Keys = require('../schema/Keys');

const getNotifications = asyncHandler(async (req, res) => {

  const user = req.user;
  console.log(user._id);
  const id = new mongoose.Types.ObjectId(`${user._id}`);

  // const privateKey = await Keys.findOne({ publicKey: pemFormatKey })

  const transactions = await Transaction.find({
    $or: [
      { userId: new mongoose.Types.ObjectId(`${id}`) },
      { referenceId: new mongoose.Types.ObjectId(`${id}`) }
    ]
  });

  let transactionTransformed = [];
  for (let i = 0; i < transactions.length; i++) {
    if ((transactions[i].userId).toString() === (user._id).toString()) {
      console.log("al")
      let obj = {};
      obj.senderName = transactions[i].senderName;
      obj.receiverName = transactions[i].receiverName;
      obj.amount = transactions[i].amount;
      obj.date = transactions[i].createdAt;
      obj.type = 'sent';
      const isoString = transactions[i].createdAt;
      const date = new Date(isoString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      obj.time = `${hours}:${minutes}`;
      transactionTransformed.push(obj);
    }
    else if ((transactions[i].referenceId).toString() === (user._id).toString()) {
      let obj = {};
      obj.senderName = transactions[i].senderName;
      obj.receiverName = transactions[i].receiverName;
      obj.amount = transactions[i].amount;
      obj.date = transactions[i].createdAt;
      obj.type = 'received';
      const isoString = transactions[i].createdAt;
      const date = new Date(isoString);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      obj.time = `${hours}:${minutes}`;
      transactionTransformed.push(obj);
    }
  }

  console.log(transactions)
  console.log(transactionTransformed)

  return res.status(200).json(
    new ApiResponse(
      200,
      { transactionTransformed },
      'Notifications fetched successfully.'
    )
  );
});



module.exports = {
  getNotifications
};