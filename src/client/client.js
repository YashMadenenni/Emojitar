/**Maker Tab Begin*/
const images = [];
const faceImages = [];
const eyesImages = [];
const mouthImages = [];
const hairImages = [];

let faceComponent = null;
let eyesComponent = null;
let mouthComponent = null;
let hairComponent = null;

let faceColor = "undefined";
let eyesColor = "undefined";
let mouthColor = "undefined";
let hairColor = "undefined";

let faceImage = new Image();
let eyesImage = new Image();
let mouthImage = new Image();
let hairImage = new Image();
/**Maker Tab End*/

/**Browser Tab Begin*/
let emojis = [];
/**Browser Tab End*/

/**Login-Register Tab*/
let realUsername = "anonymous";

/**
 * Function Purpose: load the page while window onload
 * 1. getAllFacialComponent(): fetch facial components from the server
 * 2. defaultActive: to click the default-active webpage -> Maker
 */
function loadPage() {
  getAllFacialComponent();
  getAllEmojitars();
  creatorSelectionLoading();
  loginPage();
  document.getElementById("defaultActive").click();
  previewImage();  
  uploadFile()
}
/**
 * Function: to open a page and disable other pages.
 * @param {*} pageName :the ready-open page
 * @param {*} event    :active the ready-open page
 */
function openPage(pageName,event) {
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  var tablinks = document.getElementsByClassName("tablink");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }
  document.getElementById(pageName).style.display = "block";
  event.currentTarget.classList.add("active");
}
/**
 * Section 1 Begin: Maker Tab Functions----------------------------------------------------------------------------------
 */
/**
 * Function: to get all facial component from API
 */
function getAllFacialComponent() {
  fetch('/components')
  .then(response => response.json())
  .then(data => {images.push(...data);
                  seperateFacialComponent()
                  createAllFacialComponentButton()});
}
/**
 * Function: to seperate facial component based on its type
 */
function seperateFacialComponent() {
  images.forEach(image => {
    if (image.type === 'face') {
      faceImages.push(image);
    } else if (image.type === 'eyes') {
      eyesImages.push(image);
    } else if (image.type === 'mouth') {
      mouthImages.push(image);
    } else if (image.type === 'hair') {
      hairImages.push(image);
    }
  });
}
/**
 * Function: tempelate to create specific component grid
 * @param {*} elementID 
 * @param {*} images 
 */
function createFacialComponentButton(elementID, images) {
  const html = document.getElementById(elementID);
  html.innerHTML= '';

  images.forEach(image => {
    let htmlSegment = `<div class="button-wrapper" onclick=canvas("${image.type}","${image.url}","${image.filename}")>
                          <div id="button">
                            <span class="tooltiptext">${image.description}</span>
                            <img id ="${image.filename}" src="${image.url}" alt="not found">
                          </div>
                      </div>`;
    html.innerHTML += htmlSegment;
  });
}
/**
 * Function: to create facial componenets girds: 
 * 1.face
 * 2.mouth
 * 3.eyes
 * 4.hair
 */
function createAllFacialComponentButton() {
  createFacialComponentButton("faceScroll",faceImages);
  createFacialComponentButton("mouthScroll",mouthImages);
  createFacialComponentButton("eyesScroll",eyesImages);
  createFacialComponentButton("hairScroll",hairImages);
}
/**
 * https://stackoverflow.com/questions/14742381/combining-multiple-images-to-one-on-html5-canvas
 */
function drawEmojitar() {
  let canvas = document.querySelector(".emoji-canvas");
  let context = canvas.getContext("2d");

  canvas.width = 15000;
  canvas.height = 15000;
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(faceImage, 0, 0, canvas.width, canvas.height);
  context.drawImage(eyesImage, 0, 0, canvas.width, canvas.height);
  context.drawImage(mouthImage, 0, 0, canvas.width, canvas.height);
  context.drawImage(hairImage, 0, 0, canvas.width, canvas.height);
}
/**
 * Function: to set the emojitar canvas (in Maker)
 * @param {*} componentType face/eyes/mouth/hair
 * @param {*} imageFilename 
 */
function canvas(componentType, imageURL, imageName) {
  let path = imageURL;

  switch (componentType) {
    case "face":
      faceImage.src = path;
      faceImage.onload = drawEmojitar();
      faceComponent = imageName;
      break;
    case "eyes":
      eyesImage.src = path;
      eyesImage.onload = drawEmojitar();
      eyesComponent = imageName;
      break;
    case "mouth":
      mouthImage.src = path;
      mouthImage.onload = drawEmojitar();
      mouthComponent = imageName;
      break;
    case "hair":
      hairImage.src = path;
      hairImage.onload = drawEmojitar();
      hairComponent = imageName;
      break;
    }
}
/**
 * Constructor for Component Color
 * @param {*} faceColor   color of face
 * @param {*} eyesColor   color of eyes
 * @param {*} mouthColor  color of mouth
 * @param {*} hairColor   color of hair
 */
function Color(faceColor, eyesColor, mouthColor, hairColor) {
  this.faceColor = faceColor;
  this.eyesColor = eyesColor;
  this.mouthColor = mouthColor;
  this.hairColor = hairColor;
}
/**
 * Function: save the emojitar information to server
 * 1. get the value to write in the emojitarComponent.json (id, description, username, date)
 * 2. check if the needed value is null/empty (id, description, username, date, all facial components)
 * 3. if one the needed values is invalid --> alert to notify the user
 *    if all needed values are valid --> write into the json file
 */
function postButton() {
  let id = document.getElementById("inputID").value;
  let description = document.getElementById("inputDescription").value;
  let username = realUsername;
  
  let currentDate = new Date();
  let year = currentDate.getFullYear() + '-';
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-';
  let date = ('0' + currentDate.getDate()).slice(-2) + ' ';
  let hour = ('0' + currentDate.getHours()).slice(-2) + ':';
  let min = ('0' + currentDate.getMinutes()).slice(-2) + ':';
  let second = ('0' + currentDate.getSeconds()).slice(-2) + ' ';
  let timeZone =  'GMT' + (currentDate.getTimezoneOffset() > 0 ? '-' : '+') +
                          ('0' + Math.abs(currentDate.getTimezoneOffset() / 60)).slice(-2) + ':' + 
                          ('0' + Math.abs(currentDate.getTimezoneOffset() % 60)).slice(-2);
  const dateString = year + month + date + hour + min + second + timeZone;

  if (realUsername === "anonymous") {
    alert(`
    Anonymous user are not allowed to post an emojitar.
    Please log in first`);
  } else if (!id || !description || !username || 
      !faceComponent || !eyesComponent || !mouthComponent || !hairComponent) {
    alert(`
    Valid post should include:
    - id
    - description
    - username
    - all facial components: face, eyes, mouth, hair`);
  } else if (emojis.some(emoji => emoji.id === id)) {
    alert('Duplicate Emojitar ID');
  } else {
    let color = new Color(faceColor,eyesColor,mouthColor,hairColor);
    let comment = new Comment();
    let emoji = new emojiDetails
    (id, description, username, [faceComponent, eyesComponent, mouthComponent, hairComponent], color, dateString, comment);
    
    fetch('/addEmoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emoji)
    })
    .then(response => {
      if (response.ok) {
        alert('Successfully upload your emojitar');
      } else {
        alert('fail to upload your emojitar');
      }
    })
    .catch(error => {
      alert('fail to upload your emojitar');
      console.error('Error:', error);
    });
  }
  getAllEmojitars();
}
/**
 * Function: constructor for emojiData
 * @param {*} id 
 * @param {*} description 
 * @param {*} username 
 * @param {*} facialComponents 
 * @param {*} date 
 */
function emojiDetails(id, description, username, components, filter, date, comment) {
  this["emoji-id"] = id;
  this["description"] = description;
  this["userName"] = username;
  this["images"] = components;
  this["filter"] = filter;
  this["date"] = date;
  this["comments"] = comment;
}
/**
 * Constructor
 */
function Comment() {

}
/**
 * Section 1 End: Maker Tab Functions----------------------------------------------------------------------------------
 */





/**
 * Section 2 Begin: Browser Tab Functions----------------------------------------------------------------------------------
 */
/**
 * Emoji Constructor: images, username, description
 * @param {*} images       all facial component(face, eyes, mouth, hair)
 * @param {*} username     creator's name
 * @param {*} description  emoji description
 */
function Emoji(id, images, username, description, comments) {
  this.id = id;
  this.images = images;
  this.username = username;
  this.description = description;
  this.comments = comments;
}
/**
 * Function: to get all existing emojitar info from json while loading.
 * Information stored in array including: (1)images, (2)username, (3)description, (4)comments
 * Note: the reason to get comments -> can be viewed commented specifically
 */
function getAllEmojitars() {
  emojis = [];
  fetch('/existingEmojies')
  .then(response => response.json())
  .then(data => {
    Object.keys(data).forEach(key => {
      const userData = data[key];
      userData.forEach(emoji => {
        const emojiObj = new Emoji(emoji['emoji-id'], emoji.images, emoji.userName, emoji.description, emoji.comments);
        emojis.push(emojiObj);
      });
      loadAllEmojitars();
      allCanvas();
      creatorSelectionLoading();
    });
  })
  .catch(error => console.error(error));
}
/**
 * Function: to load all emojitars all at onces
 * Item Display: (1)images, (2)username, (3)description
 */
function loadAllEmojitars() {
  const html = document.getElementById("Browser-Grid");
  html.innerHTML= '';
  emojis.forEach(emoji => {
    let htmlSegment = `<div class="emojis-wrapper">
                          <div id="emoji">
                            <canvas id="emoji-canvas-${emoji.id}"></canvas>
                          </div>
                          <p>Created by ${emoji.username}</p>
                          <p>${emoji.description}</p>
                          <button id="view-comments" onclick="viewSpecificEmojitar(${emoji.id})">View Comments</button><p></p>
                          <button id="delete-emoji" onclick="deleteEmojitar(${emoji.id},'${emoji.username}')">Delete Emojitar</button>
                      </div>`;
    html.innerHTML += htmlSegment;
  });
}
/**
 * Function: to load the image on page
 * @param {*} url the resource url of the specific facial component
 * @returns       the image src
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
    image.src = url;
  });
}
/**
 * Function: to set the canvas for emoji (reusable code for multiple emojis)
 * @param {*} emojiImages all facial component's file name of a specific emoji (include: face/eyes/mouth/hair)
 * @param {*} emojiID     a specific emoji ID
 */
async function specificCanvas(emojiImages, emojiID) {
  const canvasName = "emoji-canvas-" + emojiID;
  const canvas = document.getElementById(canvasName);
  const context = canvas.getContext("2d");

  canvas.width = 200;
  canvas.height = 200;

  const facePic = await loadImage("../server/components/" + emojiImages[0]);
  const eyesPic = await loadImage("../server/components/" + emojiImages[1]);
  const mouthPic = await loadImage("../server/components/" + emojiImages[2]);
  const hairPic = await loadImage("../server/components/" + emojiImages[3]);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(facePic, 0, 0, canvas.width, canvas.width);
  context.drawImage(eyesPic, 0, 0, canvas.width, canvas.width);
  context.drawImage(mouthPic, 0, 0, canvas.width, canvas.width);
  context.drawImage(hairPic, 0, 0, canvas.width, canvas.width);
}
/**
 * Function: to set the canvas of all emojis (Browser Tab)
 */
function allCanvas() {
  emojis.forEach(emoji => {
    specificCanvas(emoji.images, emoji.id);
  })
}
/**
 * Function: to display info about a specific Emojitar, include:
 * (1) images: face/eyes/mouth/hair
 * (2) creator
 * (3) description
 * @param {*} emojiID the specific emoji object
 */
function viewSpecificEmojitar(emojiID) {
  const emoji = getSpecificEmojitar(emojiID.toString());
  const emojiComment = emoji.comments;
  const emojiImages = emoji.images;
  const html = document.getElementById("Browser-Grid");
  html.innerHTML= '';
  let htmlSegment = `<div id="specific-emoji-info">
                        <div id="a-emoji-display">
                        </div>
                        <div id="a-emoji-info">
                          <p>Created by ${emoji.username}</p>
                          <p></p>
                          <p>${emoji.description}</p>
                        </div>
                      </div>

                      <div id="sepcific-emoji-comment">
                        <div id="comment-rate-setting-area">
                        </div>
                        <div id="all-comment-area">
                        </div>
                      </div>`;
  html.innerHTML += htmlSegment;
  setLayoutForEmojiImage(emojiImages, emoji.id);
  setLayoutForCommentSetting(emoji);
  setLayoutForAllComments(emojiComment);
}
/**
 * Function: to set the layout for a specific emojitar
 * @param {*} emojiImageArray 
 */
function setLayoutForEmojiImage(emojiImageArray, emojiID) {
  const html = document.getElementById("a-emoji-display");
  html.innerHTML = '';
  let htmlSegment = `<div class="image-container">
                        <canvas id="emoji-canvas-${emojiID}"></canvas>
                      </div>`;
  html.innerHTML += htmlSegment;
  specificCanvas(emojiImageArray, emojiID);
}
/**
 * Function: to set the layout for rating/comment/username user input
 * Cited: https://www.w3schools.com/tags/tag_select.asp
 */
function setLayoutForCommentSetting(emojiObj) {
  const emoji = emojiObj;
  const html = document.getElementById("comment-rate-setting-area");
  html.innerHTML= '';
  let htmlSegment = `<div class="rating-container">
                        <label for="rating">Rating:</label>
                        <select name="rating" id="rating">
                          <option value=1>1</option>
                          <option value=2>2</option>
                          <option value=3>3</option>
                          <option value=4>4</option>
                          <option value=5>5</option>
                        </select><p></p>
                        <label for="comment">Comment</label>
                        <input type="text" id="comment" name="comment"><p></p>
                        <button id="submit-comment" onclick="submitComment(${emoji.id})">Submit Comment</button>
                      </div>`;
  html.innerHTML += htmlSegment;
}
/**
 * Function: to submit a comment of a specific emojitar
 * Debug: should be kept finished after the server part built the endpoint.
 * @param {*} emojiObjID ID of emojitar
 */
function submitComment(emojiObjID) {
  let rating = document.getElementById("rating").value;
  let commentor = realUsername;
  let comment = document.getElementById("comment").value;
  let emojiID = emojiObjID.toString();

  let currentDate = new Date();
  let year = currentDate.getFullYear() + '-';
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-';
  let date = ('0' + currentDate.getDate()).slice(-2) + ' ';
  let hour = ('0' + currentDate.getHours()).slice(-2) + ':';
  let min = ('0' + currentDate.getMinutes()).slice(-2) + ':';
  let second = ('0' + currentDate.getSeconds()).slice(-2) + ' ';
  let timeZone =  'GMT' + (currentDate.getTimezoneOffset() > 0 ? '-' : '+') +
                          ('0' + Math.abs(currentDate.getTimezoneOffset() / 60)).slice(-2) + ':' + 
                          ('0' + Math.abs(currentDate.getTimezoneOffset() % 60)).slice(-2);
  const dateString = year + month + date + hour + min + second + timeZone;

  let emoji = getSpecificEmojitar(emojiObjID.toString());

  if (realUsername === "anonymous") {
    alert(`
    Anonymous user are not allowed to comment.
    Please log in first`);
  } else if (commentor === emoji.username) {
    alert("You are only allowed to comment emojitars created by other users");
  } else if (!comment) {
    alert("Valid comments should include both rating and comment");
  } else {
    let data = {
      "emojiId": emojiID,
      "userName": commentor,
      "comment": {
        "rating": rating,
        "comments":comment,
        "date": dateString
      }
    }
  
    fetch('/addComment', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)})
      .then(response => {
      if (response.ok) {alert('Commented!');} 
      else {alert('Failed to comment');}})
      .catch(error => {console.error(error);});
  }
  reloadComment(emojiObjID);
}
/**
 * Function: to reload the comments part of a specific emoji when a new comment is added
 * @param {*} emojiObjID specific emoji ID
 */
function reloadComment(emojiObjID) {
  emojis = [];
  fetch('/existingEmojies')
  .then(response => response.json())
  .then(data => {
    Object.keys(data).forEach(key => {
      const userData = data[key];
      userData.forEach(emoji => {
        const emojiObj = new Emoji(emoji['emoji-id'], emoji.images, emoji.userName, emoji.description, emoji.comments);
        emojis.push(emojiObj);
      });
      const emoji = getSpecificEmojitar(emojiObjID.toString());
      console.log(emoji);
      let emojiComments = emoji.comments;
      setLayoutForAllComments(emojiComments);
    });
  })
  .catch(error => console.error(error));
}
/**
 * Function: to get all comment's info of a specific emoji
 * @param {*} commentObj comments array(in comment obj: commentor name, rating, commentText)
 * @returns all comment's info of a specific emoji
 */
function getAllComments(comments) {
  let allComments = [];
  Object.keys(comments).forEach((commentor) => {
    const rating = comments[commentor].rating;
    const commentText = comments[commentor].comments;
    allComments.push({ commentor, rating, commentText });
  });
  return allComments;
}
/**
 * Function: to set the layout for all comments of a specific emojitar
 * @param {*} specificEmojiComments comments(rating/commentor/comment) of specific emojitar 
 */
function setLayoutForAllComments(specificEmojiComments) {
  let allComments = getAllComments(specificEmojiComments);
  const html = document.getElementById("all-comment-area");
  html.innerHTML= '';

  if (allComments.length < 1) {
    let htmlSegment = `<div class="all-comment-wrapper">
                        <p>No Comment</p>
                      </div>`;
    html.innerHTML += htmlSegment;
  } else {
    allComments.forEach((comment) => {
      let htmlSegment = `<div class="all-comment-wrapper">
                          <p><strong>${comment.rating} star(s)</strong> ${comment.commentor}</p>
                          <p></p>
                          <p>${comment.commentText}</p><br>
                        </div>`;
      html.innerHTML += htmlSegment;
    });
  }
}
/**
 * Function: to return from a single emoji to all emoji pages
 */
function returnToAllEmojitars() {
  emojis = [];
  getAllEmojitars();
}
/**
 * Function: to get specific emojitar object
 * @param {*} emojiID the ID of the need emoji
 * @returns Emoji object
 */
function getSpecificEmojitar(emojiID) {
  return emojis.find(emoji => emoji.id === emojiID) || null;
}
/**
 * Function: to create selection options
 */
function creatorSelectionLoading() {
  let creators = getCreators();
  let html = document.getElementById("creators");
  html.innerHTML= '';

  creators.forEach(creator => {
    let htmlSegment = `<option value=${creator}>${creator}</option>`;
    html.innerHTML += htmlSegment;});
}
/**
 * Function: to get all creators' name (no duplicate), this function is to create selection option.
 * @returns an array of creator's name
 */
function getCreators() {
  let creators = [];
  emojis.forEach((emoji) => {
    if (!creators.includes(emoji.username)) {
      creators.push(emoji.username);
    }
  });
  return creators;
}
/**
 * Function: to load all emojis created by a specific creator
 * (1) get all specific emojis
 * (2) all those emojis  --> turn all emojis into just emojis with specific criteria
 */
function selectCreatorButton() {
  let creator = document.getElementById("creators").value;
  let thseemojis = getSpecificEmoji(creator);
  loadSpecificEmojis(thseemojis);
  allCanvas();
  creatorSelectionLoading();
}
/**
 * Function: to get specific emoji based on creator's name criteria and display them
 * @param {*} creator specific creator's name
 * @returns emojis that meet the criteria
 */
function getSpecificEmoji(creator) {
  let specificEmojis = [];
  emojis.forEach(emoji => {
    if (emoji.username === creator && !specificEmojis.includes(creator)) {
      specificEmojis.push(emoji);
    }
  });
  return specificEmojis;
}
/**
 * Function: to load all emojis with specific criteria
 * @param {*} specificEmojis all emojis with specific criteria
 */
function loadSpecificEmojis(specificEmojis) {
  let specificEmojitars = specificEmojis;
  const html = document.getElementById("Browser-Grid");
  html.innerHTML= '';
  specificEmojitars.forEach(emoji => {
    let htmlSegment = `<div class="emojis-wrapper">
                          <div id="emoji">
                            <canvas id="emoji-canvas-${emoji.id}"></canvas>
                          </div>
                          <p>Created by ${emoji.username}</p>
                          <p>${emoji.description}</p>
                          <button id="view-comments" onclick="viewSpecificEmojitar(${emoji.id},${emoji.username})">View Comments</button>
                      </div>`;
    html.innerHTML += htmlSegment;
  });
}
/**
 * Function: to delete the Specific Emojitar
 * @param {*} emojiID       specific emojitar ID
 * @param {*} emojiCreator  specific emojitar creator
 */
function deleteEmojitar(emojiObjID, emojiCreator) {
  let userName = realUsername;
  let emojiID = emojiObjID.toString();

  if (realUsername === "anonymous") {
    alert("Anonymous are not allowed to delete any Emojitar");
  } else if (emojiCreator != userName) {
    alert("User can only delete their own Emojitar");
  } else {
    fetch(`/deleteEmoji/${userName}/${emojiID}`, {
      method: 'DELETE',
    }).then(response => {
      if (response.ok) {
        alert('Emoji deleted successfully. Reload the page now....');
      } else {
        alert('Failed to delete emoji.');
      }
    }).catch(error => {
      console.error('An error occurred while deleting emoji:', error);
    });
  }
  returnToAllEmojitars();  //since emoji is delete, so refresh the page.
}
/**
 * Section 2 End: Browser Tab Functions----------------------------------------------------------------------------------
 */




/**
 * Section 3 Begin: Component Tab Functions----------------------------------------------------------------------------------
 */
function uploadFile() {
  document.getElementById('uploadForm').addEventListener('submit',(event)=>{
    event.preventDefault();
    
    var currentDate = new Date();

    const formData = new FormData(document.getElementById('uploadForm'));
    formData.append("date",currentDate);
    fetch('/uploadImage',{
      method:'POST',
      body:formData
    }).then(response=>{
      if (response.ok) {
        window.alert("Successfully Uploaded");
      }else if (response.status == 415) {
        window.alert("Failed!. File type is not .PNG");
      }else if(response.status == 413){
        window.alert("Failed!. File larger than 2MB");
      }else{
        window.alert("Failed!.");
      }
    })
  });
}

function previewImage() {
  document.getElementById("imageInput").addEventListener("change",()=>{
    const fileInput = document.getElementById("imageInput").files[0];
   
    const fileReader = new FileReader();
   
    fileReader.onload=()=>{
     document.getElementById("preview").innerHTML = '<img class="preview" src='+fileReader.result+'>'
    }
    fileReader.readAsDataURL(fileInput);
   });
}



/**
 * Section 3 End: Component Tab Functions----------------------------------------------------------------------------------
 */




/**
 * Section 4 Begin: Login/Register Tab Functions----------------------------------------------------------------------------------
 */
/**
 * Function: to display the visual effect for login page
 * The reason to not directly write into the html: 
 * after login, login element will be removed; however, we might want to use it again
 */
function loginPage() {
  let html = document.getElementById("account-box");
  html.innerHTML = '';
  let htmlSegment = ` <h1>Login</h1>
                        <table>
                        <tr>
                          <td><label for="username">Username:</label></td>
                          <td><input type="text" id="log-username" name="log-username"><p></p></td>
                        </tr>
                        <tr>
                          <td><label for="password">Password:</label></td>
                          <td><input type="text" id="log-password" name="log-password"><p></p></td>
                        </tr>
                      </table>
                      <button id="login-button" onclick="loginButton()">Login</button>&nbsp
                      <button id="register-page-button" onclick="registerPage()">Register</button>`;
  html.innerHTML += htmlSegment;
}
/**
 * Function: to display the visual effect for register page
 */
function registerPage() {
  let html = document.getElementById("account-box");
  html.innerHTML = '';
  let htmlSegment = ` <h1>Register</h1>
                        <table>
                        <tr>
                          <td><label for="username">Username:</label></td>
                          <td><input type="text" id="register-username" name="register-username"><p></p></td>
                        </tr>
                        <tr>
                          <td><label for="password">Password:</label></td>
                          <td><input type="text" id="register-password" name="register-password"><p></p></td>
                        </tr>
                      </table>
                      <button id="register-button" onclick="registerSubmit()">Register</button>&nbsp
                      <button id="log-in-page" onclick="loginPage()">Back to Login</button>`;
  html.innerHTML += htmlSegment;
}
/**
 * Function: to display the visual effect for after-login Page
 */
function loggedPage() {
  let html = document.getElementById("account-box");
  html.innerHTML = '';
  let htmlSegment = ` <h1>Succesfully Login: ${realUsername}</h1>
                      <button id="log-out-button" onclick="logoutButton()">Log Out</button>`;
  html.innerHTML += htmlSegment;
}
/**
 * Function: to log in (check if the name & password match to the data in user.json)
 * Then 1-> change the realUsername from "anonymous" to input username
 * Then 2-> change to the login page
 */
function loginButton() {
  let username = document.getElementById("log-username").value;
  let password = document.getElementById("log-password").value;

  let loginData = {
    "userName": username,
    "password": password,
  };

  fetch('/userAuthentication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => {
    if (response.status === 200) {
      alert("User authorized");
      realUsername = username;
      loggedPage();
    } else {
      alert("User unauthorized");
    }
  })
  .catch(error => console.error(error));
}
/**
 * Function: to log out
 * Then 1-> change the realUsername back to "anonymous"
 * Then 2-> change the display back to login Page.
 */
function logoutButton() {
  realUsername = "anonymous";
  loginPage();
}
/**
 * Function: to submit a register information: include username + password
 * Then --> if the username has already existed, alert
 * Then --> if the username is not existing, save it
 */
function registerSubmit() {

  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("A valid register include: username & password");
  } else {
    let registerData = {
      "userName": username,
      "password": password
    }
  
    fetch('/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
    .then(response => {
      if (response.status === 200) {
        alert("Successfully Registered");
      } else if (response.status === 409) {
        alert("Username Already Exist");
      } else {
        alert("Fail to Register");
      }
    })
    .catch(error => console.error(error));
  }
}
/**
 * Section 4 End: Login/Register Tab Functions----------------------------------------------------------------------------------
 */



/**
 * Call the functions while loading/refreshing
 */
window.onload = function() {
  loadPage();
}