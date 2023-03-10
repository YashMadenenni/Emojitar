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

window.onload = function() {
  document.getElementById("defaultActive").click();
}