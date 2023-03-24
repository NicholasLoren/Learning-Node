const express = require("express")
const Joi = require("joi")

/*==================IMPORTS=========================*/

const app = express()
app.use(express.json())
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
app.get('/api/genres',(req,res)=>{
    res.send(genres)
})


//Get a single course

app.get('/api/genres/:id',(req,res)=>{
    const {id} = req.params
    const genre = genres.find((genre)=> genre.id === parseInt(id))
    if(!genre) return res.status(404).send("OOPS! genre not found.")
    
    return res.send(genre)
})

//Create a genre

app.post('/api/genres/',(req,res)=>{
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

app.delete("/api/genres/:id",(req,res)=>{
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

app.put('/api/genres/:id',(req,res)=>{
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



// Listen to dynamic port
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Listening on port ",port)
    console.log("App Ready!")
})