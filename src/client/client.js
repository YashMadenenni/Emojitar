const images = [];
const faceImages = [];
const eyesImages = [];
const mouthImages = [];
const hairImages = [];

let faceImage = new Image();
let eyesImage = new Image();
let mouthImage = new Image();
let hairImage = new Image();
/**
 * Function Purpose: load the page while window onload
 * 1. getAllFacialComponent(): fetch facial components from the server
 * 2. defaultActive: to click the default-active webpage -> Maker
 */
function loadPage() {
  getAllFacialComponent();
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
    let htmlSegment = `<div class="button-wrapper" onclick=canvas("${image.type}","${image.filename}")>
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
  context.imageSmoothingEnabled = true;

  canvas.width = 80;
  
  context.clearRect(0, 0, canvas.width, canvas.width);
  context.drawImage(faceImage, 0, 40, canvas.width, canvas.width);
  context.drawImage(eyesImage, 0, 40, canvas.width, canvas.width);
  context.drawImage(mouthImage, 0, 40, canvas.width, canvas.width);
  context.drawImage(hairImage, 0, 40, canvas.width, canvas.width);
}
/**
 * Function: to set the emojitar canvas
 * @param {*} componentType face/eyes/mouth/hair
 * @param {*} imageFilename 
 */
function canvas(componentType, imageFilename) {
  let path = '/emojis/'
  path += imageFilename;

  switch (componentType) {
    case "face":
      faceImage.src = path;
      faceImage.onload = drawEmojitar();
      break;
    case "eyes":
      eyesImage.src = path;
      eyesImage.onload = drawEmojitar();
      break;
    case "mouth":
      mouthImage.src = path;
      mouthImage.onload = drawEmojitar();
      break;
    case "hair":
      hairImage.src = path;
      hairImage.onload = drawEmojitar();
      break;
    }
}
/**
 * Call the functions while loading/refreshing
 */
window.onload = function() {
  loadPage();
}

// example for sending Post emoji request
//  window.onload()=function name(params) {
   // const data = {
  //   "userName": "NewUser",
  //   "emojiDetails":{
  //         "emoji-id":6,
  //         "description":"Nice",
  //         "userName":"Ya-ling",
  //         "images":["eyes-pale-blue.png","hair-bob-brown"]
  //     }
  // };
  
  // fetch('http://localhost:8000/addEmoji', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // });
// }

