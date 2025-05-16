const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = 3000
const userController = require('./routes/user.route')
const cardController = require('./routes/card.route')
// const keysController = require('./controllers/keys.controller')
// const generalController = require('./controllers/general.controller')

require('./db/connection')


app.use(express.json())

app.use(cors({
  origin: 'http://localhost:8000', // frontend URL
  credentials: true                // allow cookies
}));

app.use('/api/user', userController)
app.use('/api/card', cardController)
// app.use('/api/keys', keysController)
// app.use('/api/general', generalController)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
