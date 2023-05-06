const auth = require("../../../middleware/auth")
const { Users } = require("../../../models/users")
const mongoose = require("mongoose")

describe('auth middleware',()=>{
    it('should populate req.user with the payload of JWT',()=>{
        const user = {_id:mongoose.Types.ObjectId().toHexString(),isAdmin:true}
        const token = new Users(user).generateToken()
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res ={}
        const next = jest.fn()
        auth(req,res,next)

        expect(req.user).toBeDefined()
        expect(req.user).toMatchObject(user)
    })
})