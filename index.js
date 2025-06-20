const express = require('express')
require('dotenv').config()
const cors = require('cors')
const nodemailer = require('nodemailer')
const app = express()
const port = 3000
const userController = require('./routes/user.route')
const cardController = require('./routes/card.route')
const keysController = require('./routes/keys.route')
const paymentController = require('./routes/payment.route')
const notificationsController = require('./routes/notifications.route')
// const generalController = require('./controllers/general.controller')
const createTransactionReceipt = require("./utils/createTransactionRecepit")

require('./db/connection')

const data = {
  senderName: 'John Doe',
  amount: 100,
  receiverName: 'Alice Smith',
  email: 'john.doe@example.com',
};


// createTransactionReceipt(data);


app.use(express.json())

app.use(cors({
  origin: ['http://localhost:8000',
    'https://payment-wallet-system.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/user', userController)
app.use('/api/card', cardController)
app.use('/api/keys', keysController)
app.use('/api/payment', paymentController)
app.use('/api/notifications', notificationsController)

app.get('/', async (req, res) => {
  res.send('server is up!')
})


app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
  console.log("hello fro servfvfvver")
})
