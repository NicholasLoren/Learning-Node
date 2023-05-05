const mongoose = require('mongoose')
const Joi = require('joi')

// create a mongoose schema
const genreSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
})

const Genre = mongoose.model('Genre', genreSchema)

//Validation method for genres
const validate = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  })

  return schema.validate(genre)
}

exports.validate = validate
exports.Genre = Genre
exports.genreSchema = genreSchema
