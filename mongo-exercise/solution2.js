const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/mongo-exercises")
.then(()=> console.log("Connecting to Mongo DB"))
.catch(err => console.error("Error",err))

//create a schema for our courses
const courseSchema = new mongoose.Schema({
    name:String,
    author:String,
    tags:[String],
    isPublished:Boolean,
    price:Number,
    date:Date
})

//create a model
const Course = mongoose.model("Course",courseSchema)

async function getCourses() {
    return await Course.find({isPublished:true})
    .or({tags:'frontend'})
    .or({tags:'backend'})
    .sort("-price")
    .select("name author")
}

async function run() {
    const courses = await getCourses()
    console.log(courses)
}

run()
