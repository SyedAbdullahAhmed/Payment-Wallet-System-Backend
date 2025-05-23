const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = 3000
const userController = require('./routes/user.route')
const cardController = require('./routes/card.route')
const keysController = require('./routes/keys.route')
const paymentController = require('./routes/payment.route')
const notificationsController = require('./routes/notifications.route')
// const generalController = require('./controllers/general.controller')

require('./db/connection')


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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
