const { User, Identity } = require('../models')
const bcrypt = require('bcrypt')

module.exports = {
  // GET all users
  async getAll(req, res) {
    try {
      const users = await User.findAll({ include: Identity })
      res.json(users)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // GET user by ID
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { include: Identity })
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // POST create new user
  async create(req, res) {
    try {
      const { name, username, password, identity_id } = req.body
      const user = await User.create({ name, username, password, identity_id })
      res.status(201).json(user)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // PUT update user
    async update(req, res) {
        const { name, username, oldPassword, newPassword } = req.body
        const userId = req.user.id

        try {
        const user = await User.findByPk(userId)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const updateData = { name, username }

        // Jika ingin ubah password
        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isMatch) {
            return res.status(401).json({ message: 'Password lama salah' })
            }
            const hashed = await bcrypt.hash(newPassword, 10)
            updateData.password = hashed
        }

        await User.update(updateData, { where: { id: userId } })
        res.json({ message: 'Profile updated' })
        } catch (err) {
        res.status(500).json({ error: err.message })
        }
    },

  // DELETE user
  async delete(req, res) {
    try {
      await User.destroy({ where: { id: req.params.id } })
      res.json({ message: 'User deleted' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
