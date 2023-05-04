
const mongoose = require('mongoose')
const winston = require("winston")
const config = require("config")
module.exports = function(){
    
//connect to mongoose db
const db = config.get('db')
mongoose
.connect(db)
.then(() => {
  winston.info(`Connecting to ${db}`)
})
.catch((err) => console.log(err.message))

}