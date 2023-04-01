const express = require("express")
const router = express.Router()


router.get("/", (req, res) => {
    res.send("Hello world")
    // res.render("home",{title:"My Node App title",message:"Hello world",name:'Nicholas Loren'})
});


module.exports = router