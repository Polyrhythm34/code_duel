/* global io */
/* global $ */
/* global Image */
/* global CanvasInput */
var socket = io();

var canvasWidth = 1000;
var canvasHeight = 800;
var mouse = {};
var keyPressed;
var newGame;
var frameNo = 0;
var characterArray;
var correctKeyIndex;
var randomScript;
var userid;
var opponentid;

var bgImage = new Image();
bgImage.src = "/images/town.jpg";

var logonImage = new Image();
logonImage.src = "/images/black.png";

var startButton = new Image();
startButton.src = "/images/start.png";
startButton.flag = false;

var canvas = document.getElementById("gamespace");
$('#gamespace').focus();
canvas.onmouseup = function(event) {mouseClick(event)};
var context = canvas.getContext("2d");

var frameText = new component("20px", "Arial", "black", 850, 30, "text");

var toType = new component("20px", "Arial", "grey", 20, 640, "text");
var haveTyped = new component("20px", "Arial", "red", 20, 640, "text");

var opponentType = new component("20px", "Arial", "grey", canvasWidth/2 + 20, 640, "text");
var opponenthasTyped = new component("20px", "Arial", "red", canvasWidth/2 + 20, 640, "text");

var myRect = new component(canvasWidth, 200, "white", 0, canvasHeight - 200, "black");
var player1Rect = new component(canvasWidth/2, 200, "", 0, canvasHeight - 200, "black");
var player2Rect = new component(canvasWidth/2, 200, "", canvasWidth/2, canvasHeight - 200, "black");


window.onbeforeunload = function() {
    console.log('unload');
    socket.emit('disconnect');
};

window.onload = function() {
    context.canvas.width = canvasWidth;
    context.canvas.height = canvasHeight;
    context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
    logon();
};


socket.on('receive user id', function(msg){
    userid = msg;    
});

socket.on('you have been challenged', function(msg){
    if (confirm('new challenge ' + msg )) {
        socket.emit("accept challenge", msg);
    } else {
        socket.emit('denied challenge', msg);
    }
});
socket.on('challenge accepted', function(msg) {
    $('#gamespace').focus();
    opponentid = msg;
    newGame = false;
});

socket.on('challenge denied', function(msg) {
    alert(msg +' did not accept your challenge!');
});

socket.on('sending script', function(msg) {
    randomScript = msg;
    startGame();
});

socket.on('have typed message', function(msg) {
    opponenthasTyped.text = msg;
});

socket.on('to type message', function(msg) {
    opponentType.text = msg;
});

socket.on('update users', function(msg) {
    var usersUl = document.getElementById("users");
    var body = document.getElementById('index');
    var placeholder = document.getElementById('placehoder');
    usersUl.innerHTML = '';
    for (let user of msg) {
        if(user == userid) {
            var li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
            var userList = document.createTextNode(user);
            li.appendChild(userList);
            usersUl.appendChild(li);
        } else {
            var userModal = createModal(user);
            body.insertBefore(userModal, placeholder);
            var li = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', ('#challenge'+ user));
            link.setAttribute('data-toggle', 'modal');
            li.setAttribute('class', 'list-group-item');
            
            var userList = document.createTextNode(user);
            link.appendChild(userList);
            li.appendChild(link);
            usersUl.appendChild(li);
        }
    }
});

function createModal(user) {
    var userModal = document.createElement('div');
    userModal.setAttribute("class", "modal fade");
    userModal.setAttribute("id", ("challenge" + user));
    userModal.setAttribute("role", "dialog");
    var modalDialog = document.createElement('div');
    modalDialog.setAttribute("class", "modal-dialog");
    var modalContent = document.createElement('div');
    modalContent.setAttribute("class", "modal-content");
    var modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    var h4 = document.createElement('h4');
    h4.setAttribute('style', 'color:red;');
    var h4Text = document.createTextNode('CHALLENGE: ' + user);
    var span = document.createElement('span');
    span.setAttribute('class', 'glyphiccon glyphicon-lock');
    h4.appendChild(span);
    h4.appendChild(h4Text);
    modalHeader.appendChild(h4);
    var modalBody = document.createElement('div');
    modalBody.setAttribute('class', 'modal-body');
    
    var buttonYes = document.createElement('button');
    buttonYes.setAttribute('type', 'submit');
    buttonYes.onclick = function() {
        buttonYes.setAttribute('data-dismiss', 'modal');
        socket.emit('challenge', user);
    };
    buttonYes.setAttribute('class', 'btn btn-default btn-success btn-block');
    var buttonYesText = document.createTextNode('Challenge');
    buttonYes.appendChild(buttonYesText);
    
    var buttonNo = document.createElement('button');
    buttonNo.setAttribute('type', 'submit');
    buttonNo.setAttribute('class', 'btn btn-default btn-default btn-block');
    buttonNo.setAttribute('data-dismiss', 'modal');
    var buttonNoText = document.createTextNode('Cancel');
    buttonNo.appendChild(buttonNoText);
    
    modalBody.appendChild(buttonYes);
    modalBody.appendChild(buttonNo);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    userModal.appendChild(modalDialog);
    return userModal;
}

function startGame() {
    
    newGame = true;
    toType.text = randomScript;
    opponentType.text = randomScript;
    haveTyped.text = "";
    opponenthasTyped.text = "";
    correctKeyIndex = 0;
    
    characterArray = toType.text.split("");
    for (var i = 0; i < characterArray.length; i++) {
        if (characterArray[i] == "\r") {
            characterArray.splice(i, 1);
        }
        if (characterArray[i] == "\n") {
            characterArray[i] = "Enter";
        }
            
    }
    canvas.interval = setInterval(updateGameArea, 20);
}

function mouseClick(e) {
    mouse.x = e.pageX - $('#gamespace').offset().left;
    mouse.y = e.pageY - $('#gamespace').offset().top;
    if(startButton.flag && mouse.x > startButton.xpos && mouse.x < startButton.width + startButton.xpos){
        if(mouse.y > startButton.ypos && mouse.y < startButton.height + startButton.ypos){
            newGame = false;
        }
    }
}

window.onkeydown = function(e) {
    
    keyPressed = e.key;
   
    if (keyPressed == characterArray[correctKeyIndex]) {
        if(keyPressed == "Enter" ) {
            keyPressed = "\n";
            haveTyped.text = "";
            toType.text = toType.text.slice(toType.text.indexOf("\n") +1 , toType.text.length);
           
        } else {
            haveTyped.text = haveTyped.text + keyPressed;
        }
        socket.emit('have typed', haveTyped.text, opponentid);
        socket.emit('to type', toType.text, opponentid);
        
        correctKeyIndex++;
    }
    return !(e.keyCode == 32 && (e.target.type != 'text' && e.target.type != 'textarea'));
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;    
    this.x = x;
    this.y = y;
    
    this.update = function() {
        if (this.type == "text") {
            context.font = this.width + " " + this.height;
            context.fillStyle = color;
            var lineheight = 23;
            var lines = this.text.split('\n');
            for (var i = 0; i<lines.length; i++) {
                context.fillText(lines[i], this.x, this.y + (i*lineheight));
            }
        } else {
            context.fillStyle = color;
            context.strokeStyle = this.type;
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.fillRect(this.x, this.y, this.width, this.height);
            
        }
    };
}


function logon() {
    context.globalAlpha = 0.7;
    context.drawImage(logonImage,0,0,canvasWidth, canvasHeight);
    context.globalAlpha = 1;
    var username = new CanvasInput({
      canvas: canvas,
      x: canvasWidth/2 - 150,
      y: canvasHeight/2 - 50,
      fontSize: 18,
      fontFamily: 'Arial',
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 300,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 3,
      boxShadow: '1px 1px 0px #fff',
      innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
      placeHolder: 'User Name'
    });
    var password = new CanvasInput({
      canvas: canvas,
      x: canvasWidth/2 - 150,
      y: canvasHeight/2,
      fontSize: 18,
      fontFamily: 'Arial',
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 300,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 3,
      boxShadow: '1px 1px 0px #fff',
      innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
      placeHolder: 'Password'
    });
}

function updateGameArea() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    startButton.flag = false;
    
    frameNo += 1;
    frameText.text="Frame: " + frameNo;
   
    context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight -200);
    
    myRect.update();
    player1Rect.update();
    player2Rect.update();
    
    frameText.update();
    toType.update();
    haveTyped.update();
    opponentType.update();
    opponenthasTyped.update();
}
