const mongoose = require("mongoose")
const Joi = require("joi")
const { Customers } = require("./customers")

const schema = mongoose.Schema({
    customer:new mongoose.Schema({
        name:{
            type:String,
            minlength:5,
            maxlength:255,
            required:true
        }, 
        phone:{
            type:String,
            minlength:5,
            maxlength:255,
            required:true
        }
    }),
    movie:new mongoose.Schema({
        title: {
            type: String,
            required:true,
            maxlength:155,
            minlength:5
        },
        dailyRentalRate:{
            type:Number,
            min:0,
            required:true
        },

    }),
    dateOut:{
        type:Date,
        default: Date.now,
    },
    rentalFee:{
        type:Number, 
    },
    returnDate:{
        type:Date
    }
})

const Rentals = mongoose.model("Rental",schema)

function validate (rental){
    const schema = Joi.object({
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required(), 
    })

    return schema.validate(rental)
}







module.exports.validate = validate
module.exports.Rentals = Rentals