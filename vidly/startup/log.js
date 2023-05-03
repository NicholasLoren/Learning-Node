const winston = require('winston')

module.exports = function () {
  winston.add(new winston.transports.File({ filename: 'errorlog.log' }))
  winston.add(new winston.transports.Console({level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )}))
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
}
