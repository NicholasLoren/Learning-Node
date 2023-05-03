const express = require('express')
const winston = require('winston')
const app = express()

require('winston-mongodb')
require('express-async-errors')
require('./startup/validate')()
require('./startup/log')()
require('./startup/config')()
require('./startup/routes')(app)
require('./startup/db')()

// Listen to dynamic port
const port = process.env.PORT || 3000

app.listen(port, () => {
  winston.info('Listening on port ', port)
})
