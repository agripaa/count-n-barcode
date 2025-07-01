require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

// Routes
const routes = require('./routes')

// Middleware
app.use(cors())
app.use(express.json()) // body parser for JSON

// Register Routes
app.use('/api/v1', routes)

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
