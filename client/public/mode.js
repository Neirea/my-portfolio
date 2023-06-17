var D = "rgb(25,25,25)";
var L = "rgb(245, 245, 245)";
document.body.style.background =
    localStorage.getItem("darkMode") === "0" ? L : D;
