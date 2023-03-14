const express = require("express");
const path = require('path');
const API_PORT = 8000;
const app = express();
const fs = require("fs");
app.use(express.json());
app.listen(API_PORT);
console.log("server started");


// Allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


//API for all users 
app.get('/users',function (request,response) {
  fs.readFile(__dirname+"/"+"users.json","utf8",function (err,data) {
      //console.log(data);
      response.end(data);
  });    
});

//API for user authentication
app.post('/userAuthentication',function (request,response) {
  fs.readFile(__dirname+"/"+"users.json","utf8",function (err,data) {
        var users = JSON.parse(data);
        var userName = request.body.userName;
        var password = request.body.password;
        for (const key in users) {

            if(((users[key].name== userName))&&((users[key].password==password))){
                 console.log("Got it");
                 response.status(200); //Authorized
            }else{
              response.status(401); //Unauthorized
            }
        }
        
    });    
});

/**
 * Endpoint: get images (include: images and relative info from csv file)
 */
app.use('/server/components', express.static(path.join(__dirname, 'components')));
app.use(express.static(path.join(__dirname, '../client')));
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
          image.url = `/server/components/${file}`; //modify trail
          images.push(image);
        }
      });
      res.json(images);
    });
  });
});

//API to send emoji images by name
app.get('/emojis/:imageName',function (request,response) {
  response.sendFile(__dirname+"/components/"+request.params.imageName);
});

//API for send exsisting emojitars 
app.get('/exsistingEmojies',function (request,response) {
  
  fs.readFile("emojitarComponents.json",(error,data)=>{
    if(error){
      console.error(error);
    }else{
      const jSON_Data = JSON.parse(data);
      response.json(jSON_Data);
    }
  });
  
});

//Add new emojitars
app.post('/addEmoji',function (request,response) {

    const userName = request.body.userName;
    const postData = request.body;

  //Read File
  const json_Data=fs.readFileSync("emojitarComponents.json","utf-8");
  const existingData = JSON.parse(json_Data);

  // Check if user exists in existing data
  if (!existingData[userName]) {
    existingData[userName] = [];
  }



  // Add post data to user's data
  existingData[userName].push(postData);

  //Write to file
  fs.writeFile("emojitarComponents.json",JSON.stringify(existingData, null, 2),function (err) {
    console.log("Writing"); 
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
});

//API for comments 
app.get('/addComment',function (request,response) {
  const emojitarId =  request.body.eomjiId;
  const userName =  request.body.userName;
  const comment =  request.body.comment;
  //const rating = request.body.rating;
  //const date = request.body.date;

  const jsonData = fs.readFileSync("emojitarComponents.json", "utf-8");
  const existingData = JSON.parse(jsonData);

  let emojitar = null;
  for (const user in existingData) {
    const emojitars = existingData[user];
    emojitar = emojitars.find(e => e["emoji-id"] === emojiId);
    if (emojitar) {
      break;
    }
  }

  const emojitarComments = emojitar.comments;
  if (emojitarComments && emojitarComments[userName]) {
    emojitarComments[userName] = comment;
  } else {
    if (!emojitarComments) {
      emojitar.comments = {};
    }
    emojitarComments[userName] = comment;
  }

  // Write to file
  fs.writeFile("emojitarComponents.json", JSON.stringify(existingData, null, 2), function (err) {
    console.log("Adding comment");
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
});

//Delete an emoji
app.delete("/deleteEmoji/:userName/:emojiID",function (request,response) {
  const userName = request.params.userName;
  const emojiIdDelete = request.params.emojiID;

  //Read File
  const json_Data=fs.readFileSync("emojitarComponents.json","utf-8");
  const existingData = JSON.parse(json_Data);

  //get user object
  for (const key in existingData) {
    if (key == userName) {
      const userEmojis = existingData[userName];
      let indexToRemove;
      if(userEmojis.length >0){
        userEmojis.forEach(element=>{
          if(element["emoji-id"]==emojiIdDelete){
            indexToRemove = userEmojis.indexOf(element);
            console.log(indexToRemove);
          }
        });
        userEmojis.splice(indexToRemove,1);
      }else{
        response.send(404);//emoji not found or already deleted
      }
      
    }
  }

  console.log(existingData);
  // Writing updated data to file
  fs.writeFile("emojitarComponents.json", JSON.stringify(existingData, null, 2), function (err) {
    console.log("Deleting emoji");
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });

});


