const { Counting, Identity } = require('../models')

module.exports = {
  // GET all
    async getAll(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        const { count, rows } = await Counting.findAndCountAll({
        include: Identity,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
        })

        res.json({
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalData: count,
        data: rows
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
    },


  // GET by ID
  async getById(req, res) {
    try {
      const data = await Counting.findByPk(req.params.id, { include: Identity })
      if (!data) return res.status(404).json({ message: 'Data not found' })
      res.json(data)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // POST create (🔓 No Auth)
  async create(req, res) {
    try {
      const { count, predicted_date, predicted_time, identity_id } = req.body
      const created = await Counting.create({ count, predicted_date, predicted_time, identity_id })
      res.status(201).json(created)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // PUT update
  async update(req, res) {
    try {
      const { count, predicted_date, predicted_time, identity_id } = req.body
      const updated = await Counting.update(
        { count, predicted_date, predicted_time, identity_id },
        { where: { id: req.params.id } }
      )
      res.json({ message: 'Updated', updated })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      await Counting.destroy({ where: { id: req.params.id } })
      res.json({ message: 'Deleted' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
