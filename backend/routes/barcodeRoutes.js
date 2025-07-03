const express = require('express')
const router = express.Router()
const controller = require('../controllers/barcodeController')
const authMiddleware = require('../middlewares/authMiddleware')

// 🔓 Public Create
router.post('/', controller.create)
router.post('/device', controller.receiveBarcode)

// 🔐 Protected
router.get('/', authMiddleware, controller.getAll)
router.get('/:id', authMiddleware, controller.getById)
router.put('/:id', authMiddleware, controller.update)
router.delete('/:id', authMiddleware, controller.delete)

module.exports = router
