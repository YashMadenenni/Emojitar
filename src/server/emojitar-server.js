const express = require("express");
const path = require('path');
const API_PORT = 8000;
const app = express();
const fs = require('fs');

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
  const components = [];
  const csvFilePath = path.join(__dirname, 'componentInfo.csv');

  fs.readFile(csvFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Parse the CSV data
    const rows = data.trim().split('\n').map(row => row.split(','));

    // Read the image files and create a component object for each file
    const imagePath = path.join(__dirname, '/components');
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
        const info = rows.find(row => row.filename === file);
        const component = {
          type: info[0],
          id: info[1],
          description: info[2],
          filename: info[3],
          user: info[4],
          date: info[5],
          url: `/components/${file}`
        };
        components.push(component);
      });
      res.json(components);
    });
  });
});

app.listen(API_PORT);
