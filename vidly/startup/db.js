
const mongoose = require('mongoose')
const winston = require("winston")
module.exports = function(){
    
//connect to mongoose db
mongoose
.connect('mongodb://localhost/vidly')
.then(() => {
  winston.info('Connecting to mongo DB')
})
.catch((err) => console.log(err.message))

}