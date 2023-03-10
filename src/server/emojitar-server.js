const express = require("express");
const API_PORT = 8000;
const app = express();
var fileModule = require("fs");

console.log("server started");

app.get('/users',function (request,response) {
    fileModule.readFile(__dirname+"/"+"users.json","utf8",function (err,data) {
        console.log(data);
        response.end(data);
    });    
});

app.get('/users/:userName/:password',function (request,response) {
    fileModule.readFile(__dirname+"/"+"users.json","utf8",function (err,data) {
        var users = JSON.parse(data);
        var userName = request.params.userName;
        var password = request.params.password;
        for (const key in users) {
                    
            if(((users[key].name== userName))&&((users[key].password==password))){
                 console.log("Got it");
            //     console.log(users[key].name);
            // console.log("user "+userName);
            // console.log(users[key].password);
            // console.log("pass "+password);
            }
        }
        //console.log(request.params)
    });    
});


app.listen(8000);
