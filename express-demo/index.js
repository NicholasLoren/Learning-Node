const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "Website Designing" },
  { id: 2, name: "Database Programming" },
  { id: 3, name: "React JS" },
];

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );

  if (!course) return res.status(404).send("Course was not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  // Schema for my course object
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  //Validate
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);

  res.send(course);
});

//updating courses
app.put("/api/courses/:id", (req, res) => {
  //Look for course
  //If not existing , return 404
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!course) return res.status(404).send("Course was not found");

  //Validate
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //If valid

  course.name = req.body.name;
  res.send(course);
  //return the updated course
});

app.delete("/api/courses/:id", (req, res) => {
  //Look for course
  //If not existing , return 404
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!course) return res.status(404).send("Course was not found");
 


});

const validateCourse = (course) => {
  // Schema for my course object
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  //If invalid, return bad request
  return schema.validate(course);
};

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Listening on port 3000"));
