const { Identity } = require('../models')

module.exports = {
  // GET all
  async getAll(req, res) {
    try {
      const data = await Identity.findAll()
      res.json(data)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // GET by ID
  async getById(req, res) {
    try {
      const data = await Identity.findByPk(req.params.id)
      if (!data) return res.status(404).json({ message: 'Identity not found' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // POST create (🔓 no auth)
  async create(req, res) {
    try {
      const { IP, temp } = req.body
      const created = await Identity.create({ IP, temp })
      res.status(201).json(created)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // PUT update
  async update(req, res) {
    try {
      const { IP, temp } = req.body
      const updated = await Identity.update(
        { IP, temp },
        { where: { id: req.params.id } }
      )
      res.json({ message: 'Identity updated', updated })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      await Identity.destroy({ where: { id: req.params.id } })
      res.json({ message: 'Identity deleted' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
