const express = require("express");
const path = require('path');
const API_PORT = 8000;
const app = express();
const fs = require('fs');

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

app.use(express.static(path.join(__dirname, '../client')));

app.get('/components', (req, res) => {
  const images = [];
  const imageInfo = [];
  const csvFilePath = path.join(__dirname, '../server/componentInfo.csv');

  fs.readFile(csvFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Parse the CSV data
    const rows = data.trim().split('\n').map(row => row.split(','));

    // Add each row to the imageInfo array
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const image = {
        type: row[0],
        id: row[1],
        description: row[2],
        filename: row[3],
        user: row[4],
        date: row[5]
      };
      imageInfo.push(image);
    }

    // Read the image files and add them to the images array
    const imagePath = path.join(__dirname, '../server/components');
    fs.readdir(imagePath, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      files = files.filter(file => {
        const extension = path.extname(file);
        return extension === '.png';
      });
      files.forEach(file => {
        const image = {
          filename: file
        };
        const info = imageInfo.find(info => info.filename === file);
        if (info) {
          image.type = info.type;
          image.id = info.id;
          image.description = info.description;
          image.user = info.user;
          image.date = info.date;
        }
        image.url = `/components/${file}`;
        images.push(image);
      });
      res.json(images);
    });
  });
});


app.listen(API_PORT);
