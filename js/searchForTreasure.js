
var click;

var map = document.querySelector('.map');
var sensor = document.querySelector('.sensor');
var maxX = map.clientWidth - sensor.clientWidth;
var maxY = map.clientWidth - sensor.clientWidth;


function digging(partOfMap) {
    if (click == 10) {
        digged = document.querySelector(partOfMap);
        digged.update;
        click = 0;
    } else {
        click++;
    }
}

function handleOrientation(event) {

    var y     = event.beta; // x axis
    var x    = event.gamma; // y axis

    output.textContent  = `beta : ${x}\n`;
    output.textContent += `gamma: ${y}\n`;

    // We dont want to move the device upside down
    if (x >  90) { x =  90};
    if (x < -90) { x = -90};

    //shift range
    x += 90;
    y += 90;

    ball.style.top  = (maxY*y/180 - 10) + "px";
    ball.style.left = (maxX*x/180 - 10) + "px";
}

window.addEventListener('deviceorientation', handleOrientation, true);