const express = require('express')
const Joi = require('joi')
const { Users } = require('../models/users')
const bcrypt = require('bcrypt')
const router = express.Router() 
const auth = require("../middleware/auth")
const validator = require('../middleware/validator')

router.post('/',validator(validate), async (req, res) => {
  
  //check if user exists
  const user = await Users.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password')

  //check if password is correct
  const isValid = bcrypt.compareSync(req.body.password, user.password)
  if (!isValid) return res.status(400).send('Invalid email or password')

  //authenticate user 
  return res.send(user.generateToken())
})

function validate  (user)  {
  const schema = Joi.object({
    email: Joi.string().required().max(255).email(),
    password: Joi.string().required().min(6).max(255),
  })

  return schema.validate(user)
}


router.get("/me",auth,async(req,res)=>{
  //read the user values from request
  return res.send(req.user)

})

module.exports = router
