import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    // ==============================
    // 1. Extract Authorization Header
    // ==============================
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    // ==============================
    // 2. Extract Token
    // ==============================
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    // ==============================
    // 3. Verify Token
    // ==============================
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    console.log('DECODED:', decoded)

    // ==============================
    // 4. Fetch User (Lean = faster)
    // ==============================
    const user = await User.findById(decoded.id).select('-password').lean()

    console.log('USER:', user?._id)

    if (!user) {
      return res.status(401).json({ msg: 'User not found' })
    }

    // ==============================
    // 5. Attach User
    // ==============================
    req.user = user

    next()
  } catch (error) {
    // ==============================
    // 6. Granular Error Handling
    // ==============================
    console.log('AUTH ERROR:', error.name)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' })
    }

    return res.status(401).json({ msg: 'Not authorized' })
  }
}
