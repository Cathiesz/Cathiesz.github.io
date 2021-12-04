var i;
var inputTextValue = document.getElementById("input_id").value;
window.onkeyup = joinSite;;

function generateSite() {
    i = parseInt(Math.random() * 1000);
    location.href = i
}

function joinSite(e) {
    if (e.keyInput == 13) {
        window.location = "http://cathiesz.github.io/mobile/" + inputTextValue;
    }
}