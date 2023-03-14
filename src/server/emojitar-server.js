const express = require("express");
const path = require('path');
const API_PORT = 8000;
const app = express();
//const fileUpload = require('express-fileUpload');
const multer = require('multer');
const csvWriter = require("csv-writer").createObjectCsvWriter;

const fs = require("fs");
const multer = require("multer");
const { writer } = require("repl");
const { createObjectCsvWriter } = require("csv-writer");
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
app.get('/users', function (request, response) {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    //console.log(data);
    response.end(data);
  });
});

//API for user Registeration
app.get('/user/register', function (request, response) {
  const userKey = request.body.userKey; // "user4" 
  const userName = request.body.userName;  //"Test"
  const id = request.body.userID; //4
  const password = request.body.username; //"test"
  const contentBody = {
    "name": userName,
    "password": password,
    "id": id
  }

  const userJsonData = fs.readFileSync(__dirname + "/" + "users.json", "utf8");
  const existingUserData = JSON.parse(userJsonData);

  if (existingUserData[userKey]) {
    response.sendStatus(409);
    console.log("error data exist");
  } else if (!existingUserData[userKey]) {
    existingUserData[userKey] = contentBody
  }
  //console.log(existingUserData);

  // Write to file
  fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(existingUserData), function (err) {
    console.log("Adding user");
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });

});


//API for user authentication
app.post('/userAuthentication', function (request, response) {

  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    var users = JSON.parse(data);
    var userName = request.body.userName;
    var password = request.body.password;
    for (const key in users) {

      if (((users[key].name == userName)) && ((users[key].password == password))) {
        console.log("Got it");
        response.sendStatus(200); //Authorized
      } else {
        response.sendStatus(401); //Unauthorized
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
app.get('/emojis/:imageName', function (request, response) {
  response.sendFile(__dirname + "/components/" + request.params.imageName);
});

//API for send existing emojitars 
app.get('/existingEmojies', function (request, response) {

  fs.readFile("emojitarComponents.json", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      const jSON_Data = JSON.parse(data);
      response.json(jSON_Data);
    }
  });

});

//Add new emojitars
app.post('/addEmoji', function (request, response) {

  const userName = request.body.userName;
  const postData = request.body;

  //Read File
  const json_Data = fs.readFileSync("emojitarComponents.json", "utf-8");
  const existingData = JSON.parse(json_Data);

  // Check if user exists in existing data
  if (!existingData[userName]) {
    existingData[userName] = [];
  }



  // Add post data to user's data
  existingData[userName].push(postData);

  //Write to file
  fs.writeFile("emojitarComponents.json", JSON.stringify(existingData, null, 2), function (err) {
    console.log("Writing");
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      response.sendStatus(200);
    }
  });
});

//API to send a particular emoji
app.get('/getEmoji/:emojiId', function (request, response) {
  const emojiID = request.params.emojiId;

  const json_Data = fs.readFileSync("emojitarComponents.json", "utf-8");
  const existingData = JSON.parse(json_Data);

  var dataToSend;

  for (const key in existingData) {
    var userEmojiArray = existingData[key];

    userEmojiArray.forEach(element => {
      if (element["emoji-id"] == emojiID) {
        dataToSend = element;
      }
    });
  }

  if (dataToSend != undefined) {
    console.log(Object.keys(dataToSend).length);
    response.json(dataToSend);
  } else {
    response.sendStatus(404);
  }
})


//API for comments emojiId:
app.post('/addComment', function (request, response) {
  const emojitarId = request.body.emojiId; //"2"
  const userName = request.body.userName; //"user2";
  const comment = request.body.comment;
  //console.log(request.body)
  //console.log(emojitarId+ " " +userName+" "+comment)
  /**{
    "rating": "1",
    "comments": "I just added",
    "date": "2023-03-12 12:11:36 GMT+00:00"
  } */
  //const rating = request.body.rating;
  //const date = request.body.date;
  //Read File
  const json_Data = fs.readFileSync("emojitarComponents.json", "utf-8");
  const existingData = JSON.parse(json_Data);

  //Check if user has already commented on this emoji
  for (const key in existingData) {
    if (key != userName) {
      if (existingData[key].length > 0) {
        var existingEmojis = existingData[key];
        //console.log(existingEmojis)
        existingEmojis.forEach(element => {
          //console.log(element["emoji-id"] + " " +emojitarId)
          if (element["emoji-id"] == emojitarId) {
            // console.log(element["emoji-id"]);
            // console.log(element["comments"]);
            var existingComments = element["comments"];
            //console.log(existingComments);
            if (existingComments.length > 0) {
              if (existingComments[userName]) {
                //console.log("in loop")
                existingComments[userName] = comment;
              } else {
                //console.log("in else")
                existingComments[userName] = comment;
              }
            } else {
              //console.log("in else 2")
              existingComments[userName] = comment;
            }

          }
        });

      }
    }
  }

  // Write to file
  fs.writeFile("emojitarComponents.json", JSON.stringify(existingData, null, 2), function (err) {
    console.log("Adding comment");
    if (err) {
      console.log(err);
      response.sendStatus(500);
    } else {
      //console.log(existingData);
      //response.send(existingData);
      response.sendStatus(200);
    }
  });
});



//Delete an emoji
app.delete("/deleteEmoji/:userName/:emojiID", function (request, response) {
  const userName = request.params.userName;
  const emojiIdDelete = request.params.emojiID;

  //Read File
  const json_Data = fs.readFileSync("emojitarComponents.json", "utf-8");
  const existingData = JSON.parse(json_Data);

  //get user object
  for (const key in existingData) {
    if (key == userName) {
      const userEmojis = existingData[userName];
      let indexToRemove;
      if (userEmojis.length > 0) {
        userEmojis.forEach(element => {
          if (element["emoji-id"] == emojiIdDelete) {
            indexToRemove = userEmojis.indexOf(element);
            console.log(indexToRemove);
          }
        });
        userEmojis.splice(indexToRemove, 1);
      } else {
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

//Set up
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'components'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
//API to upload image
app.post('/uploadImage', upload.single("file"), function (request, response) { //file is the name to be used in post data for file
  console.log(request.file);
  const { image } = request.file;
  if (!image) return response.sendStatus(400);

  response.sendStatus(200);


  const newData = {
    type: request.body.type,
    id: request.body.id,
    description: request.body.description,
    filename: request.file.originalname,
    user: request.body.user,
    date: request.body.date
  }
  const writerToCsv = csvWriter({
    path: "componentInfo.csv",
    header: false
  });
  writerToCsv.writeRecords([newData]).then(() => {
    console.log("done")
    response.sendStatus(200)
  });
});


