
const mongoose = require('mongoose')
const Joi = require('joi')

//create a customer schema

const customerSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
  
  //create a model
  
  const Customers = mongoose.model('Customer', customerSchema)
  


  //Validation method for customers
function validate  (customer) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean(),
      phone: Joi.string(),
    })
  
    return schema.validate(customer)
  }

exports.validate = validate
exports.Customers = Customers