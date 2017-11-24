/* global io */
/* global $ */
/* global Image */
var socket = io();
//define functions socket.emit sending to server (app.js) and socket.on receiving 
// 'new message' is for the id of the socket and $('#new-message') is for the button
function sendFunction() {
    socket.emit('new message', $('#new-message').val());
    $('#new-message').val('');
};
// 'chat message' is for the id of the socket and $('#new-area') is for the text area
socket.on('chat message', function(msg) {
    $('#messages-area').append($('<li>').text(msg));
});
window.onbeforeunload = function() {
    console.log('unload');
    socket.emit('disconnect');
};

var myScore;
var bgImage = new Image();
bgImage.src = "/images/town.jpg";
var startButton = new Image();
startButton.src = "/images/start.png";
startButton.onclick = "start()";
var canvasWidth = 1000;
var canvasHeight = 500;
var newGame = true;
var mouseX;
var mouseY;
document.getElementById("gamespace").onmousemove = function(event) {checkPos(event)};


function startGame() {
    myScore = new component("20px", "Arial", "black", 850, 30, "text");
    myGameArea.start();
};

var myGameArea = {
    canvas : document.getElementById("gamespace"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.context.canvas.width = canvasWidth;
        this.context.canvas.height = canvasHeight;
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function checkPos(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
}
function start() {
    newGame = false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;    
    this.x = x;
    this.y = y;
    this.update = function() {
        let ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.drawImage(color, this.x, this.y)
        }
    }
}

function updateGameArea() {
    if (newGame) {
        myGameArea.context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
        myGameArea.context.drawImage(startButton, canvasWidth/2 - startButton.width/2, canvasHeight/2 - startButton.height/2);
        myGameArea.context.fillText("(" + mouseX + ", " + mouseY + ")", 10, 10);
        //newGame = false;
    } else {
        myGameArea.clear();
        myGameArea.context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
        myGameArea.frameNo += 1;
        myScore.text="SCORE: " + myGameArea.frameNo;
        myScore.update();
    }
};