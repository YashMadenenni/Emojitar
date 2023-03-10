const express = require('express')
const app = express()

/*
 * GET: request and response
 * https://www.youtube.com/watch?v=SccSCuHhOw0
 */
app.get('/',(req,res) => {
    console.log("Here");
    res.sendStatus(500) //err on our server
    res.send("Hi")
})
app.listen(3000)