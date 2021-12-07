var map = document.querySelector('.map');
var sensor = document.querySelector('.sensor');
var maxX = map.clientWidth - sensor.clientWidth;
var maxY = map.clientWidth - sensor.clientWidth;
var initialX = null;
var initialY = null;

// Handle the orientation if the device is a smartphone 

function handleOrientationEvent(event) {

  var x = event.beta ? event.beta : event.y * 90;
  var y = event.gamma ? event.gamma : event.x * 90;

  window.console && console.info('Raw position: x, y: ', x, y);

  if (!initialX && !initialY) {

    initialX = x;
    initialY = y;

  } else {

    var positionX = initialX - x;
    var positionY = initialY - y;

    sensor.style.top = (90 + positionX * 5) + 'px';
    sensor.style.left = (90 + positionY * 5) + 'px';
  }
}

function moveup() {
  myGamePiece.speedY = -1; 
}

function movedown() {
  myGamePiece.speedY = 1; 
}

function moveleft() {
  myGamePiece.speedX = -1; 
}

function moveright() {
  myGamePiece.speedX = 1; 
}

function clearmove() {
  myGamePiece.speedX = 0; 
  myGamePiece.speedY = 0; 
}

// Webkit and Mozilla variant beide registreren.
window.addEventListener("MozOrientation", handleOrientationEvent, true);
window.addEventListener("deviceorientation", handleOrientationEvent, true);

setTimeout(isEventFired, 2000);

