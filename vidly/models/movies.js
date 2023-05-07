const mongoose = require("mongoose")
const Joi = require("joi")
const {genreSchema} = require("./genres")


//create movie schema
const movieSchema = mongoose.Schema({
    title:{
        type:String,
        minlenght:5,
        maxlength:50,
        required:true
    },
    genre:{
        type:genreSchema,
        required:true
    },
    dailyRentalRate:{
        type:Number,
        min:0,

    },
    numberInStock:{
        type:Number,
        min:0
    }

})

const Movies = mongoose.model('Movie',movieSchema)

function validate (movie){
    const movieSchema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        dailyRentalRate: Joi.number().min(0),
        numberInStock: Joi.number().min(0),
        genreId: Joi.objectId().required()

    })

    return movieSchema.validate(movie)
}

module.exports.validate = validate
module.exports.Movies = Movies