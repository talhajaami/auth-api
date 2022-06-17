const express = require('express')
const connectDB = require('./config/db.js')
var cors = require('cors')
const app = express()
// Database connect
connectDB()

app.use(cors()) // Use this after the variable declaration
//init middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('Api running'))

app.use('/signup', require('./routes/api/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("Server is running"))