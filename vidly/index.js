const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const config = require('config')
const app = express()
require('./startup/routes')(app)
require("./startup/mongoInit")()
if (!config.get('jwtPrivateKey')) {
  console.log('Fatal Error: jwt private key not defined')
  process.exit(1)
}

winston.add(new winston.transports.File({ filename: 'errorlog.log' }))
winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    level: 'info',
  })
)

//handle unexpected exceptions
winston.exceptions.handle(
  new winston.transports.File({ filename: 'errorlog.log' })
) 

//handle rejected unhandled promises
process.on('unhandledRejection', (ex) => {
  throw ex
})

// Listen to dynamic port
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Listening on port ', port)
  console.log('App Ready!')
})
