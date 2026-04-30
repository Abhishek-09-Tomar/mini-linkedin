import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'


dotenv.config()

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api/posts', postRoutes)

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Backend is working')
})

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
