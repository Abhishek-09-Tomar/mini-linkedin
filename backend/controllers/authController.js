import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ==============================
// Generate JWT
// ==============================
const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// ==============================
// @route   POST /api/auth/register
// ==============================
export const register = async (req, res) => {
  const { name, email, password } = req.body

  try {
    console.log('REGISTER API HIT')
    console.log('BODY:', req.body)

    const userExists = await User.findOne({ email })
    console.log('USER EXISTS:', userExists)

    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    console.log('USER CREATED:', user)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.log('REGISTER ERROR:', error)
    res.status(500).json({ msg: 'Server error' })
  }
}

// ==============================
// @route   POST /api/auth/login
// ==============================
export const login = async (req, res) => {
  try {
    console.log('LOGIN API HIT')

    const { email, password } = req.body
    console.log('BODY:', req.body)

    const user = await User.findOne({ email })
    console.log('USER FOUND:', user)

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log('PASSWORD MATCH:', isMatch)

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    })
  } catch (error) {
    console.log('LOGIN ERROR:', error)
    res.status(500).json({ msg: 'Server error' })
  }
}

// ==============================
// @route   GET /api/auth/me
// ==============================
export const getMe = async (req, res) => {
  try {
    console.log('GET ME API HIT')
    res.json(req.user)
  } catch (error) {
    console.log('GET ME ERROR:', error)
    res.status(500).json({ msg: 'Server error' })
  }
}
