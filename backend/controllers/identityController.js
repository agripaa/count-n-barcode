const { Identity, User } = require('../models')

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
  async setIpByUser(req, res) {
    try {
      const userId = req.user.id
      const { IP, temp } = req.body

      if (!IP) return res.status(400).json({ message: 'IP wajib diisi' })

      // Cari user login + identity lama-nya
      const user = await User.findByPk(userId)
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' })

      const oldIdentityId = user.identity_id

      // Cek apakah IP sudah dipakai (2 type)
      const existing = await Identity.findAll({ where: { IP } })

      let identityCounting, identityBarcode

      if (existing.length === 2) {
        identityCounting = existing.find(i => i.type === 'counting')
        identityBarcode = existing.find(i => i.type === 'barcode')

        identityCounting.temp = temp
        identityBarcode.temp = temp

        await identityCounting.save()
        await identityBarcode.save()
      } else {
        // Belum ada → buat baru
        identityCounting = await Identity.create({ IP, temp, type: 'counting' })
        identityBarcode = await Identity.create({ IP, temp, type: 'barcode' })
      }

      // Update user ke identity counting
      await User.update(
        { identity_id: identityCounting.id },
        { where: { id: userId } }
      )

      res.status(200).json({
        message: 'IP berhasil diset dan user diperbarui',
        identity_counting: identityCounting,
        identity_barcode: identityBarcode
      })
    } catch (err) {
      console.error(err)
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
