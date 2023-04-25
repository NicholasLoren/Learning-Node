const express = require('express')
const Joi = require('joi')
const router = express.Router()
const mongoose = require('mongoose')

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

//get all customers
router.get('/', async (req, res) => {
  //Find all customers and return their list
  const customers = await Customers.find().sort('name')
  return res.status(200).send(customers)
})

//get a customer
router.get('/:id', async (req, res) => {
  const { id } = req.params
  //find the customer by ID
  try {
    const customer = await Customers.find({ _id: id })
    if (!customer) return res.status(404).res('Customer not found')
    return res.status(200).send(customer)
  } catch (err) {
    return res.status(404).send(err.message)
  }
})

//add a customer
router.post('/', async (req, res) => {
  const { name, isGold, phone } = req.body

  //validate
  const { error } = validateCustomer({ name, isGold, phone })

  if (error) {
    return res.status(404).send(error.details[0].message)
  }

  //add the following customers to database
  let customer = new Customers({
    name,
    isGold,
    phone,
  })

  try {
    customer = await customer.save()
    if(!customer) return res.status(400).send(customer)
    return res.status(200).send(customer)
  } catch (err) {
    return res.status(404).send(err.message)
  }
})

//update a customer
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, isGold, phone } = req.body

  //validate
  const { error } = validateCustomer({ name, isGold, phone })

  if (error) {
    return res.status(404).send(error.details[0].message)
  }

  //update the following customers to database
  let customer = new Customers({
    name,
    isGold,
    phone,
  })

  try {
    customer = await Customers.findByIdAndUpdate(
      id,
      { name, isGold, phone },
      { new: true }
    )
    if (!customer) return res.status(400).send('Could not find customer')
    return res.status(200).send(customer)
  } catch (err) {
    return res.status(404).send(err.message)
  }
})

//delete a customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const customer = await Customers.findByIdAndRemove(id)
    if (!customer) return res.status(400).send('Could not find customer')
    return res.status(200).send(customer)
  } catch (err) {
    return res.status(400).send(err.message)
  }
})

//Validation method for customers
const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string(),
  })

  return schema.validate(customer)
}
module.exports = router
