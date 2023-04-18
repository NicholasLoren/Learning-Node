const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Connecting to the mongo DB'))
  .catch((err) =>
    console.error('An error occured while establishing the connection', err)
  )

//create a course schema
const courseSchema = new mongoose.Schema({
  name: String,
  tags: [String],
  author: String,
  isPublished: Boolean,
  price: Number,
  date: Date,
})

const Course = mongoose.model('Course', courseSchema)

async function getCourses() {
  return await Course.find({isPublished:true,tags:'backend'})
  .sort({name:1})
  .select({name:1,author:1})
}

async function run() {
  const courses = await getCourses()
  console.log(courses)
}

run()
