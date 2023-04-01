const config = require("config")
const express = require("express");

const logger = require("./logger");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup")
//Import routes
const index = require("./routes/index")
const courses = require("./routes/courses")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(logger);
app.use(helmet());
// app.set("view engine","pug")
// app.set("views","./views")


//All routes
app.use("/api/courses",courses)
app.use("/",index)


if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug(("Morgan enabled..."))
} 

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Listening on port 3000"));
