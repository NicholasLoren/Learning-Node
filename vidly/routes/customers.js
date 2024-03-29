const express = require('express') 
const router = express.Router()
const {validate,Customers} = require("../models/customers")
const auth = require("../middleware/auth")
const validator = require('../middleware/validator')

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
router.post('/',[auth,validator(validate)], async (req, res) => {
  const { name, isGold, phone } = req.body

   

  //add the following customers to database
  const customer = new Customers({
    name,
    isGold,
    phone,
  })

  try {
    await customer.save()
    // if(!customer) return res.status(400).send(customer)
    return res.status(200).send(customer)
  } catch (err) {
    return res.status(404).send(err.message)
  }
})

//update a customer
router.put('/:id', auth,async (req, res) => {
  const { id } = req.params
  const { name, isGold, phone } = req.body

  //validate
  const { error } = validate({ name, isGold, phone })

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


module.exports = router
