const express = require("express");
const path = require('path');
const csv = require('csv-parser');
const API_PORT = 8000;
const app = express();
var fileModule = require("fs");

console.log("server started");

app.get('/users',function (request,response) {
  fs.readFile(__dirname+"/"+"users.json","utf8",function (err,data) {
      console.log(data);
      response.end(data);
  });    
});

app.get('/users/:userName/:password',function (request,response) {
  fs.readFile(__dirname+"/"+"users.json","utf8",function (err,data) {
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

app.use(express.static(path.join(__dirname, '../client')));
app.get('/components', (req, res) => {
    const images = [];
    const imageInfo = [];
    fs.createReadStream(path.join(__dirname, '../server/componentInfo.csv'))
      .pipe(csv())
      .on('data', row => {
        imageInfo.push(row);
      })
      .on('end', () => {
        fs.readdir(path.join(__dirname, '../server/components'), (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
          files.forEach(file => {
            const image = {};
            image.filename = file;
            const info = imageInfo.find(info => info.filename === file);
            image.type = info.type;
            image.id = info.id;
            image.description = info.description;
            image.user = info.user;
            image.date = info.date;
            image.url = `/components/${file}`;
            images.push(image);
          });
          res.json(images);
        });
      });
});

app.listen(API_PORT);
