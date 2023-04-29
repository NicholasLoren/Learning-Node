const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token)
    return res.status(401).send('Access denied, no auth token provided')

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    req.user = decoded

    next()
  } catch (ex) {
    res.send(ex.message)
  }
}
