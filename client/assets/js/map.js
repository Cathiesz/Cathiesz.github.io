var myGamePiece;
      var myObstacles = [];
      var myBoni = [];
      var myScore;
      var endscore = 0;
      var endScore;
      var border;
      var diggingSite = [];
      var diggingAllowed = false;
      var width = window.screen.width / 1.5;
      var height = window.screen.height / 2;
      var audioSound = document.getElementById("audio"); 

    function startGame() {
        myGamePiece = new component(30, 30, "black", width / 2 , height / 2, "player");
        myScore = new component("20px", "Score", "black", 0, 40, "text");
        myGameArea.start();
    }

    var myGameArea = {
        canvas : Object.assign(document.createElement("canvas"),{id : "canvas"}),
        start : function() {
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.frameNo = 0;
            this.interval = setInterval(updateGameArea, 20);
            if(window.DeviceOrientationEvent){
                window.addEventListener('keydown', function (e) {
                    e.preventDefault();
                    myGameArea.keys = (myGameArea.keys || []);
                    myGameArea.keys[e.keyCode] = (e.type == "keydown");
                })
                window.addEventListener('keyup', function (e) {
                    myGameArea.keys[e.keyCode] = (e.type == "keydown");
                })
                window.addEventListener('deviceorientation', function(event) {
                    var a = event.alpha; // "direction"
                    var b = event.beta; // left/right 'tilt'
                    var g = event.gamma; // forward/back 'tilt
                    

                    if( a > 270 || a < 90 ) {
                        if (g > 30) {
                            myGamePiece.moveUpDown = -2;
                            myGamePiece.moveLeftRight = 0;
                        }
                        else if (g < -30){
                            myGamePiece.moveUpDown =2; 
                            myGamePiece.moveLeftRight = 0;
                        }                  
                       
                        //myGamePiece.moveLeftRight = 0 - b / 1000;  
                    }
                    else {
                        if (b < 60) {
                            myGamePiece.moveLeftRight =2;
                            myGamePiece.moveUpDown = 0;
                        }
                        else if (b > 100) {
                            myGamePiece.moveLeftRight = -2;
                            myGamePiece.moveUpDown = 0;
                        }
                        
                       //myGamePiece.moveUpDown = 0 - g / 1000;
                    }

                    console.log(myGamePiece.moveLeftRight, myGamePiece.moveUpDown);
                })
            }
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop : function() {
            endscore = myGameArea.frameNo;
            localStorage.setItem("endscore", endscore);
            clearInterval(this.interval);
            window.open("lost.html","_self");
        }
    }

    
    function component(width, height, color, x, y, type) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;    
        this.x = x;
        this.y = y;    
        this.moveUpDown = 0;
        this.moveLeftRight = 0;

        this.update = function() {
            ctx = myGameArea.context;
            if (this.type == "text") {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            } else if(this.type == "player") {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);  
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);  
            }
        }
        this.newPos = function() {
            this.x += this.moveUpDown;
            this.y += this.moveLeftRight;   
        }
        this.crashWith = function(otherobj) {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mytop = this.y;
            var mybottom = this.y + (this.height);
            var otherleft = otherobj.x;
            var otherright = otherobj.x + (otherobj.width);
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + (otherobj.height);
            var crash = true;
            if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                crash = false;
            }
            return crash;
        }

        this.nearDig = function(otherobj) {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mytop = this.y;
            var mybottom = this.y + (this.height);
            var otherleft = otherobj.x;
            var otherright = otherobj.x + (otherobj.width);
            var othertop = otherobj.y;
            var otherbottom = otherobj.y + (otherobj.height);
            var near = true;
            if ((mybottom < othertop + 20) || (mytop > otherbottom + 20) || (myright < otherleft + 20) || (myleft > otherright + 20)) {
                near = false;
            }
            return near;
        }

        this.remove = function(i) {
            myBoni.splice(myBoni.indexOf(i), 1);
            myObstacles.splice(myObstacles.indexOf(i), 1);
        }
    }

    function updateGameArea() {

        for (i = 0; i < myObstacles.length; i ++) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                myGameArea.stop();
            } 
        }

        for (i = 0; i < myBoni.length; i++) {
            if (myGamePiece.crashWith(myBoni[i])) {
                myScore.text="SCORE: " + myGameArea.frameNo * 10;
                playSound();
                endscore = myGameArea.frameNo * 10;
                myScore.update();
                myBoni[i].remove(i);
                return;
            }
        }

        if (myGamePiece.x > width - 10 || myGamePiece.x < 0 || myGamePiece.y < 10 || myGamePiece.y > height ) {
                myGameArea.stop();

        }
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(100)) {
            myObstacles.push(new component(10, 10, "red", Math.random() * width - 10, Math.random() * height - 10));
            var cross = new component(10, 10, "green", Math.random() * width - 10 , Math.random() * height - 10);
            myBoni.push(cross);
        }

        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].speedX = 0;
            myObstacles[i].newPos();
            myObstacles[i].update();
        }

        for (i = 0; i < myBoni.length; i += 1) {
            myBoni[i].speedX = 0;
            myBoni[i].newPos();
            myBoni[i].update();
        }

        for (i = 0; i < diggingSite.length; i += 1) {
            diggingSite[i].speedX = 0;
            diggingSite[i].newPos();
            diggingSite[i].update();
        }

        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.moveLeftRight =2;
            myGamePiece.moveUpDown= 0; 
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            myGamePiece.moveLeftRight =-2; 
            myGamePiece.moveUpDown= 0;
        }
        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.moveUpDown=-2; 
            myGamePiece.moveLeftRight = 0;
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.moveUpDown=2; 
            myGamePiece.moveLeftRight = 0;
        }

        endscore = myGameArea.frameNo;
        console.log(endscore);
        myScore.text="SCORE: " + endscore;
        
        myScore.update();
        myGamePiece.newPos();    
        myGamePiece.update();
    }

    function everyinterval(n) {
        if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
        return false;
    }

    function clearmove() {
        myGamePiece.speedX = 0; 
        myGamePiece.speedY = 0; 
    }

	function playSound () {
		audioSound.play();
        audioSound.load();
	}

    let returnScore = () => {console.log(endscore)};

    returnScore();