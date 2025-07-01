const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET || 'rahasia'

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}
