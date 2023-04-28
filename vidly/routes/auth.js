const express = require("express")
const Joi = require("joi")
const { Users } = require("../models/users")
const bcrypt = require("bcrypt")
const router = express.Router()

router.post("/login",async(req,res)=>{
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //check if user exists
    const user = await Users.find({email:req.body.email}) 
    if(!user) return res.status(400).send("Invalid email or password")

    //check if password is correct
    const isValid = await bcrypt.compare(req.body.password,user.passowrd)
    if(!isValid) return res.status(400).send("Invalid email or password")

    //authenticate user
    return res.send(true)
})




const validate = (user)=>{
    const schema = Joi.object({
        email: Joi.string().email().required().max(255),
        passowrd: Joi.string().required().min(6).max(255)
    })

    return schema.validate()
}



module.exports = router