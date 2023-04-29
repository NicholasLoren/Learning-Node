const Joi = require('joi')
const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
})

const Users = mongoose.model('User', schema)

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(255),
  })
  return schema.validate(user)
}

module.exports.Users = Users
module.exports.validate = validate
