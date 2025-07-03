const { Identity, Counting } = require('../models');

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

  async receiveCounting(req, res) {
    try {
      const { count, ip, temp } = req.body

      // 1. Validasi input
      if (!count || !ip) {
        return res.status(400).json({ message: 'Count dan IP wajib dikirim' })
      }

      // 2. Cari identity dengan IP dan type 'counting'
      const identity = await Identity.findOne({
        where: { IP: ip, type: 'counting' }
      })

      if (!identity) {
        return res.status(403).json({
          message: 'IP tidak dikenali atau bukan untuk device counting'
        })
      }

      // 3. Update suhu jika dikirim
      if (temp) {
        identity.temp = temp
        await identity.save()
      }

      // 4. Simpan data counting
      const now = new Date()
      const predicted_date = now
      const predicted_time = now.toTimeString().split(' ')[0]

      const counting = await Counting.create({
        count,
        predicted_date,
        predicted_time,
        identity_id: identity.id
      })

      res.status(201).json({
        message: 'Data counting diterima ✅',
        data: counting
      })
    } catch (err) {
      console.error(err)
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
