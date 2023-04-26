const mongoose = require("mongoose")
const Joi = require("joi")

//create genre schema
const genreSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
//create movie schema
const movieSchema = mongoose.Schema({
    title:{
        type:String,
        minlenght:5,
        maxlength:50,
        required:true
    },
    genre:genreSchema,
    dailyRentalRate:{
        type:Number,
        min:0,

    },
    numberInStock:{
        type:Number,
        min:0
    }

})


const validate = (movie)=>{
    const movieSchema = Joi.Schema({

    })

    return Joi.validate(movieSchema,movie)
}