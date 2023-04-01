const express = require("express")
const Joi = require("joi")

const router = express.Router()
const genres = [
    {id:1,name:"Action"},
    {id:2,name:"Comedy"},
    {id:3,name:"Fantasy"},
    {id:4,name:"Drama"},
    {id:5,name:"Fiction"},
    {id:6,name:"Thriller"},
    {id:7,name:"Sci Fi"}
]
//Routes for genre

//Get all genres
router.get('/',(req,res)=>{
    res.send(genres)
})


//Get a single course

router.get('/:id',(req,res)=>{
    const {id} = req.params
    const genre = genres.find((genre)=> genre.id === parseInt(id))
    if(!genre) return res.status(404).send("OOPS! genre not found.")
    
    return res.send(genre)
})

//Create a genre

router.post('/',(req,res)=>{
    //First validate  
    const {error} = validateGenres(req.body)
    
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    //If everything is okay, add new record
    const genre = {"id": genres.length + 1,"name": req.body.name}
    genres.push( genre)
    
    res.send(genre)
})
    
//Delete record

router.delete("/:id",(req,res)=>{
    //Find the genre
    const {id} = req.params
    const genre = genres.find((genre)=> genre.id === parseInt(id))
    if(!genre) return res.status(404).send("OOPS! genre not found.")

    //Find index of genre
    const index = genres.indexOf(genre);

    //Delete Item
    genres.splice(index,1)
    res.send(genre)
    
})



//update genre

router.put('/:id',(req,res)=>{
    //Find the genre 
    const {id} = req.params
    const genre = genres.find((genre)=> genre.id === parseInt(id))
    if(!genre) return res.status(404).send("OOPS! genre not found.")

    //Validate data
    //First validate  
    const {error} = validateGenres(req.body)
    
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    //Update
    genre.name = req.body.name
    
    res.send(genre)
    

})

//Validation method for genres
const validateGenres = (genre)=>{
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    
    return schema.validate(genre) 
}


module.exports = router