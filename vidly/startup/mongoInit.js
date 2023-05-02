
const mongoose = require('mongoose')

module.exports = function(){
    
//connect to mongoose db
mongoose
.connect('mongodb://localhost/vidly')
.then(() => {
  console.log('Connecting to mongo DB')
})
.catch((err) => console.log(err.message))

}