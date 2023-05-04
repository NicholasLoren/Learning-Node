const {Users} = require("../../models/users")
const config = require('config')
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

describe('generateToken',()=>{
    it('should return a valid jwt token',()=>{
       //create a new user
       const payload = {
        isAdmin:true,
        _id:new mongoose.Types.ObjectId().toHexString()
       }
       const user = new Users(payload)

       const token = user.generateToken()
       const decode = jwt.verify(token,config.get('jwtPrivateKey'))
        
       expect(decode).toMatchObject(payload)
    })
})