const express = require('express')
const Joi = require('joi')
const { Users } = require('../models/users')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require("jsonwebtoken")
const config = require("config")

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //check if user exists
  const user = await Users.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password')

  //check if password is correct
  const isValid = bcrypt.compareSync(req.body.password, user.password)
  if (!isValid) return res.status(400).send('Invalid email or password')

  //authenticate user
  const token = jwt.sign({
    _id: user._id
  },config.get("jwtPrivateKey"))
  return res.send(token)
})

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().max(255).email(),
    password: Joi.string().required().min(6).max(255),
  })

  return schema.validate(user)
}

module.exports = router
