const express = require('express')
const router = express.Router()
const controller = require('../controllers/identityController')
const authMiddleware = require('../middlewares/authMiddleware')

// 🔓 Create tanpa auth
router.post('/', controller.create)

// 🔐 Lainnya pakai auth
router.get('/', authMiddleware, controller.getAll)
router.get('/:id', authMiddleware, controller.getById)
router.post('/set-ip', authMiddleware, controller.setIpByUser)
router.put('/:id', authMiddleware, controller.update)
router.delete('/:id', authMiddleware, controller.delete)

module.exports = router
