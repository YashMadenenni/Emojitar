const { error } = require("console");
const { response } = require("express");
const express = require("express");
const path = require('path');
const API_PORT = 8000;
const app = express();
const fs = require("fs");

app.listen(API_PORT);
console.log("server started");


// Allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

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
        
    });    
});

app.use('/server/components', express.static(path.join(__dirname, 'components')));
app.use(express.static(path.join(__dirname, '../client')));
/**
 * Endpoint: get images (include: images and relative info from csv file)
 */
app.get('/components', (req, res) => {
  const images = [];
  const imageInfo = [];
  
  // Read the component information from the CSV file
  fs.readFile(path.join(__dirname, '../server/componentInfo.csv'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    
    // Parse the CSV data
    const rows = data.trim().split('\n');
    const headers = rows.shift().split(',');
    rows.forEach(row => {
      const values = row.split(',');
      const image = {};
      headers.forEach((header, i) => {
        image[header] = values[i];
      });
      imageInfo.push(image);
    });
    console.log(imageInfo);
    
    // Read the image files and send the data to the client
    fs.readdir(path.join(__dirname, 'components'), (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        return;
      }
      files.forEach(file => {
        const image = {};
        image.filename = file;
        const info = imageInfo.find(info => info[' filename'] && info[' filename'].includes(file));
        if (info) {
          image.type = info ? info.type : undefined;
          image.id = info[' id'];
          image.description = info[' description'];
          image.user = info[' user'];
          image.date = info[' date'];
          image.url = `../server/components/${file}`;
          images.push(image);
        }
      });
      res.json(images);
    });
  });
});

app.get('/emojis/:imageName',function (request,response) {
    response.sendFile(__dirname+"/resource/"+request.params.imageName);
});


