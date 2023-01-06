var D = "rgb(25,25,25)";
var L = "rgb(245, 245, 245)";
document.body.style.background =
    localStorage.getItem("darkMode") === "on" ||
    (localStorage.getItem("darkMode") === null &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? D
        : L;
