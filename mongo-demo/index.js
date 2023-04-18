const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to mongo DB...'))
  .catch((err) => console.error('Could not connect to mongo DB...', err))

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
})

const Course = mongoose.model('Course',courseSchema)
const createCourse = async ()=>{
    const course = new Course({
        name:'Angular JS',
        author:'Nicholas',
        tags:['angular','frontend'],
        isPublished:true
    })
    
    const result = await course.save()
    console.log(result)
}
 

const getCourses = async () =>{
    const courses = await Course.find()
    console.log(courses)
}
getCourses()