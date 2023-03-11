const images = [];
const faceImages = [];
const eyesImages = [];
const mouthImages = [];
const hairImages = [];
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
 * Function: to scratch all images info from the api
 */
function getAllFacialComponent() {
  fetch('/components')
  .then(response => response.json())
  .then(data => {images.push(...data);});
}
function getAllFacialComponent() {
  fetch('/components')
    .then(response => response.json())
    .then(data => {
      images.push(...data);
      filterFacialComponent(images);
    });
}
function filterFacialComponent(images) {
  faceImages = images.filter(image => image.type === 'face');
  eyesImages = images.filter(image => image.type === 'face');
  mouthImages = images.filter(image => image.type === 'face');
  hairImages = images.filter(image => image.type === 'face');
}
/**
 * Call the functions while loading/refreshing
 */
window.onload = function() {
  loadPage();
}