const images = [];
let faceImages = [];
let eyesImages = [];
let mouthImages = [];
let hairImages = [];
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
function getAllFacialComponent() {
  fetch('/components')
  .then(response => response.json())
  .then(data => {images.push(...data);
                  seperateFacialComponent()});
}
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
 * Call the functions while loading/refreshing
 */
window.onload = function() {
  loadPage();
}