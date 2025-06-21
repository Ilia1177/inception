//SITE EN CONSTRUCTION
document.addEventListener("DOMContentLoaded", function () {
  let myDivs = document.querySelectorAll(".header");
  let newParagraph = document.createElement("p");
  newParagraph.textContent =
    "/!\\ Site en construction - MÀJ : dec 2023 - site à consulter sur écran large";
  newParagraph.style.textAlign = "left";
  newParagraph.style.textIndent = "0";
  newParagraph.style.maxWidth = "1800px";
  newParagraph.style.display = "block";
  myDivs.forEach(function (element) {
    element.insertBefore(newParagraph.cloneNode(true), element.firstChild);
  });
});

function changeScriptSrc() {
  var oldScript = document.getElementById("myScript");
  var newScript = document.createElement("script");
  newScript.id = "myScript";
  newScript.src = "sketch2.js";

  oldScript.parentNode.replaceChild(newScript, oldScript);
}
