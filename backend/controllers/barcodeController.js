const { Barcode, Identity } = require('../models')

module.exports = {
  // GET all barcodes
    async getAll(req, res) {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit

        const { count, rows } = await Barcode.findAndCountAll({
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

  async receiveBarcode(req, res) {
    try {
      const { kode_barang, ip_ethernet, temperature } = req.body

      // 1. Validasi data wajib
      if (!kode_barang || !ip_ethernet) {
        return res.status(400).json({ message: 'Kode barang dan IP wajib dikirim' })
      }

      // 2. Cari identity berdasarkan IP dan type: 'barcode'
      const identity = await Identity.findOne({
        where: { IP: ip_ethernet, type: 'barcode' }
      })

      if (!identity) {
        return res.status(403).json({
          message: 'IP tidak dikenali atau bukan untuk device barcode'
        })
      }

      // 3. Update suhu jika tersedia
      if (temperature) {
        identity.temp = temperature
        await identity.save()
      }

      // 4. Simpan data barcode
      const now = new Date()
      const predicted_date = now
      const predicted_time = now.toTimeString().split(' ')[0]

      const barcode = await Barcode.create({
        code: kode_barang,
        predicted_date,
        predicted_time,
        identity_id: identity.id
      })

      res.status(201).json({
        message: 'Data barcode diterima ✅',
        data: barcode
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  },


  // GET barcode by ID
  async getById(req, res) {
    try {
      const barcode = await Barcode.findByPk(req.params.id, { include: Identity })
      if (!barcode) return res.status(404).json({ message: 'Barcode not found' })
      res.json(barcode)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  // POST create (🔓 No auth)
  async create(req, res) {
    try {
      const { code, predicted_date, predicted_time, identity_id } = req.body
      const created = await Barcode.create({ code, predicted_date, predicted_time, identity_id })
      res.status(201).json(created)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // PUT update
  async update(req, res) {
    try {
      const { code, predicted_date, predicted_time, identity_id } = req.body
      const updated = await Barcode.update(
        { code, predicted_date, predicted_time, identity_id },
        { where: { id: req.params.id } }
      )
      res.json({ message: 'Barcode updated', updated })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  // DELETE
  async delete(req, res) {
    try {
      await Barcode.destroy({ where: { id: req.params.id } })
      res.json({ message: 'Barcode deleted' })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
