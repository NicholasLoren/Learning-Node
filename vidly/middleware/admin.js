const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  //this is to check if someone is an admin or not

  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('No auth token provided')

  try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'))

    if (!decode.isAdmin) return res.status(403).send('Forbidden access')

    next()
  } catch (ex) {
    return res.status(400).send(ex.message)
  }
}
