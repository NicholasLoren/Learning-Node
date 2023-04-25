const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to mongo DB...'))
  .catch((err) => console.error('Could not connect to mongo DB...', err))

const courseSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 255 },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type:Number, 
    required: function() { 
     return this.isPublished
    }
  }
})

const Course = mongoose.model('Course', courseSchema)
const createCourse = async () => {
  const course = new Course({
    name: 'Vue Js',
    author: 'Nicholas Loren',
    tags: [ 'frontend'],
    isPublished: true,
  })
  try{
    const result = await course.save()
    console.log(result)
    
  }catch(err){
    console.error(err.message)
  }
}

const getCourses = async () => {
  const courses = await Course.find()
  console.log(courses)
}

const updateCourse = async (id) => {
  const course = await Course.findById(id)
  if (!course) return

  course.isPublished = true
  course.author = 'Nicholas Loren'

  const result = await course.save()
  console.log(result)
}

async function deleteCourse(id) {
  const course = await Course.findByIdAndRemove({ _id: id })
  console.log(course)
}

createCourse()
