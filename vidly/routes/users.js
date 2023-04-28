const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { validate, Users } = require('../models/users')
const bcrypt = require("bcrypt")
const _ = require("lodash")

//get users
router.get('/', async (req, res) => {
  const users = await Users.find().sort('name')
  res.send(users)
})

//add users
router.post('/', async (req, res) => {
  try {
    //validate user properties
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //check if the user email already exists
    let user = await Users.findOne({email:req.body.email})
    if(user) return res.send("Email already in use")
    //genrate salt
    const salt = await bcrypt.genSalt(10)
    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    //create a new user object
    user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })

    await user.save()
    res.send(_.pick(user,["name","email"]))
  } catch (err) {
    return res.send(err.message)
  }
})

//get a user

router.get('/:id', async (req, res) => {
  const { id } = req.params
  //validate user id
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) return res.status(400).send('Invalid user id')

  const user = await Users.findById(id)
  if (!user) return res.status(400).send('User not found')

  return res.send(user)
})

//delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  //validate user id
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) return res.status(400).send('Invalid user id')
  //delete the user record
  const user = await Users.findByIdAndRemove(id)
  return res.send(user)
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    //validate user id
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if (!isValid) return res.status(400).send('Invalid user id')

    //validate user properties
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Users.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    res.send(user)
  } catch (err) {
    return res.send(err.message)
  }
})


module.exports = router
