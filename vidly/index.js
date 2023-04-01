const express = require("express")

/*==================IMPORTS=========================*/
const genres = require("./routes/genres")


const app = express()
app.use(express.json())
app.use("/api/genres/",genres)



// Listen to dynamic port
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log("Listening on port ",port)
    console.log("App Ready!")
})