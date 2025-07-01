const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia'

module.exports = {
  async register(req, res) {
    try {
      const { name, username, password } = req.body

      const exist = await User.findOne({ where: { username } })
      if (exist) return res.status(400).json({ message: 'Username already taken' })

      const hashed = await bcrypt.hash(password, 10)
      const user = await User.create({ name, username, password: hashed })

      res.status(201).json({ message: 'User registered', user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ where: { username } })

      if (!user) return res.status(404).json({ message: 'User not found' })

      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(401).json({ message: 'Wrong password' })

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1d' }
      )

      res.json({ token, user })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async profile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'username']
      })
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
