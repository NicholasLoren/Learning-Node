const express = require("express")
const {validate,Movies} = require("../models/movies")
const {Genre} = require("../models/genres") 
const auth = require("../middleware/auth")
const router = express.Router()


//get movies

router.get("/",async(req,res)=>{
    const movies = await Movies.find().sort("title")
    return res.send(movies)
}); 

//get a movie

router.get("/:id",async (req,res)=>{
    const {id} = req.params
    const movie = await Movies.findById(id)

    if(!movie) return res.status(404).send("Movie not found")

    return res.send(movie)
})

//add a movie
router.post("/",auth,async (req,res)=>{
    const {error} = validate(req.body)

    if(error) return  res.status(400).send(error.details[0].message)

    //find the genre
    const genre = await Genre.findById(req.body.genreId)
    
     
    if(!genre) return res.status(400).send("Invalid genre")

    //create a movie object
    let movie = new Movies({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre:{
            _id: genre._id,
            name: genre.name
        }
    })

    movie = await movie.save()
    return res.send(movie)
})


//delete movie
router.delete("/:id",async(req,res)=>{
    const {id} = req.params

    const movie = await Movies.findByIdAndRemove(id)
    if(!movie) return res.send("Movie not found")

    return res.send(movie)
})

//update a movie
router.put("/:id",auth,async(req,res)=>{
    const {id} = req.params 
    const {error} = validate(req.body)

    if(error) return res.send(error.details[0].message)

    const updateMovie = await Movies.findByIdAndUpdate(id,req.body)

    if(!updateMovie) return res.send(updateMovie)

    return res.send(updateMovie)
})



module.exports = router