
var click;

var map = document.querySelector('.map');
var sensor = document.querySelector('.sensor');
var maxX = map.clientWidth - sensor.clientWidth;
var maxY = map.clientWidth - sensor.clientWidth;
var initialX = null;
var initialY = null;

function digging(partOfMap) {
    if (click == 10) {
        digged = document.querySelector(partOfMap);
        digged.update;
        click = 0;
    } else {
        click++;
    }
}

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

hookEvent(document, "keydown", function(event) {
    var element, left, top;

    element = document.getElementById("sensor");
    left = parseInt(element.style.left, 10);
    top  = parseInt(element.style.top, 10);
    switch (event.which || event.keyCode) {
        case 37: // Left
            left = Math.max(0, left - 10);
            break;
        case 39: // Right
            left += 10;
            break;
        case 38: // Up
            top = Math.max(0, top - 10);
            break;
        case 40: // Down
            top += 10;
            break;
    }
    element.style.left = left + "px";
    element.style.top  = top  + "px";

    // Stop propagation and prevent default
    event.stopPropagation();
    event.preventDefault();
});

function isEventFired() {
  if (!initialX && !initialY) {
    hookEvent();
  }
}

// Webkit en Mozilla variant beide registreren.
window.addEventListener("MozOrientation", handleOrientationEvent, true);
window.addEventListener("deviceorientation", handleOrientationEvent, true);

setTimeout(isEventFired, 2000);

