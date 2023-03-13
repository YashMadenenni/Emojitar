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

/**
 * Function Purpose: load the page while window onload
 * 1. getAllFacialComponent(): fetch facial components from the server
 * 2. defaultActive: to click the default-active webpage -> Maker
 */
function loadPage() {
  getAllFacialComponent();
  getAllEmojitars();
  document.getElementById("defaultActive").click();  
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
 * Function: to set the emojitar canvas
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
  let username = document.getElementById("inputUsername").value;
  
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

  if (!id || !description || !username || 
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
    let emoji = new emojiDetails
    (id, description, username, [faceComponent, eyesComponent, mouthComponent, hairComponent], color, dateString);
    
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
}
/**
 * Function: constructor for emojiData
 * @param {*} id 
 * @param {*} description 
 * @param {*} username 
 * @param {*} facialComponents 
 * @param {*} date 
 */
function emojiDetails(id, description, username, components, filter, date) {
  this["emoji-id"] = id;
  this["description"] = description;
  this["userName"] = username;
  this["images"] = components;
  this["filter"] = filter;
  this["date"] = date;
  this["comments"] = [];
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
  fetch('/exsistingEmojies')
  .then(response => response.json())
  .then(data => {
    Object.keys(data).forEach(key => {
      const userData = data[key];
      userData.forEach(emoji => {
        const emojiObj = new Emoji(emoji['emoji-id'], emoji.images, emoji.userName, emoji.description, emoji.comments);
        emojis.push(emojiObj);
      });
      loadAllEmojitars();
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
                            <img src="../server/components/${emoji.images[0]}" alt="face not found" class="emoji-face">
                            <img src="../server/components/${emoji.images[1]}" alt="eyes not found" class="emoji-eyes">
                            <img src="../server/components/${emoji.images[2]}" alt="mouth not found" class="emoji-mouth">
                            <img src="../server/components/${emoji.images[3]}" alt="hair not found" class="emoji-hair">
                          </div>
                          <p>Created by ${emoji.username}</p>
                          <p>${emoji.description}</p>
                          <button id="view-comments" onclick="viewSpecificEmojitar(${emoji.id})">View Comments</button>
                      </div>`;
    html.innerHTML += htmlSegment;
  });
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
                      </div>
                      <div id="return-to-all-emojis-button">
                        <button id="returnToAllEmoji" onclick="returnToAllEmojitars()">Return</button>
                      </div>`;
  html.innerHTML += htmlSegment;
  setLayoutForEmojiImage(emojiImages);
  setLayoutForCommentSetting(emoji);
  setLayoutForAllComments(emojiComment);
}
/**
 * Function: to set the layout for a specific emojitar
 * @param {*} emojiImageArray 
 */
function setLayoutForEmojiImage(emojiImageArray) {
  const html = document.getElementById("a-emoji-display");
  html.innerHTML = '';
  let htmlSegment = `<div class="image-container">
                        <img src="../server/components/${emojiImageArray[0]}" alt="face not found" class="a-face">
                        <img src="../server/components/${emojiImageArray[1]}" alt="eyes not found" class="a-eyes">
                        <img src="../server/components/${emojiImageArray[2]}" alt="mouth not found" class="a-mouth">
                        <img src="../server/components/${emojiImageArray[3]}" alt="hair not found" class="a-hair">
                      </div>`;
  html.innerHTML += htmlSegment;
  
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
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username"><p></p>
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
  let commentor = document.getElementById("username").value;
  let comment = document.getElementById("comment").value;
  let emojiID = emojiObjID;

  let emoji = getSpecificEmojitar(emojiObjID.toString());

  //To-Do: written the rating + commentor + comment based on emoji ID;
}
/**
 * Function: to get all comment's info of a specific emoji
 * @param {*} commentObj comments array(in comment obj: commentor name, rating, commentText)
 * @returns all comment's info of a specific emoji
 */
function getAllComments(commentObj) {
  let allComments = [];
  const emojiComment = commentObj;
  emojiComment.forEach((comment) => {
    Object.keys(comment).forEach((commentor) => {
      const rating = comment[commentor].rating;
      const commentText = comment[commentor].comments;
      allComments.push({ commentor, rating, commentText });
    });
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
 * Section 2 End: Browser Tab Functions----------------------------------------------------------------------------------
 */




/**
 * Section 3 Begin: Component Tab Functions----------------------------------------------------------------------------------
 */


/**
 * Section 3 End: Component Tab Functions----------------------------------------------------------------------------------
 */




/**
 * Section 4 Begin: Login/Register Tab Functions----------------------------------------------------------------------------------
 */


/**
 * Section 4 End: Login/Register Tab Functions----------------------------------------------------------------------------------
 */



/**
 * Call the functions while loading/refreshing
 */
window.onload = function() {
  loadPage();
}