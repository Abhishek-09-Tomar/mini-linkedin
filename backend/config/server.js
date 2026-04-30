import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'

dotenv.config()

const app = express()

app.get('/', (req, res) => {
  res.send('Backend is working + DB')
})

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
