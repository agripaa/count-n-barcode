const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

// Semua route dilindungi token
router.use(authMiddleware)

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.post('/', userController.create)
router.put('/', userController.update)
router.delete('/:id', userController.delete)

module.exports = router
