/* global io */
/* global $ */
/* global Image */
/* global CanvasInput */
/* global SuperGif */
var socket = io();

var canvasWidth = 1000;
var canvasHeight = 800;
var mouse = {};
var keyPressed;
var newGame;
var frameNo = 0;
var characterArray;
var correctKeyIndex;
var characterDivision;
var randomScript;
var userid;
var opponentid;
var opponentName;
var userinput;
var username;
var password;
var passwordText = '';
var gunfighterindex = 0;
var opponentgunfighterindex = 0;
var changedimage = false;
var winner = false;
var countdown = false;
var loggedin = false;
var seconds;
var startSeconds;
var audio = new Audio('sounds/gunshot.wav');

var bgImage = new Image();
bgImage.src = "/images/town.jpg";

var loginButton = new Image();
loginButton.src = "/images/login.png";
loginButton.width = 320;
loginButton.height = 40;
loginButton.flag = false;
loginButton.xpos = canvasWidth/2 - 150;
loginButton.ypos = canvasHeight/2 + 50;

var logonImage = new Image();
logonImage.src = "/images/black.png";

var gunfighter = new Image();
gunfighter.src = "/images/gunfighter.png";

var gunfighter2 = new Image();
gunfighter2.src = "/images/gunfighter2.png";

var gunfighter3 = new Image();
gunfighter3.src = "/images/gunfighter3.png";

var gunfighter4 = new Image();
gunfighter4.src = "/images/gunfighter4.png";

var gunfighter5 = new Image();
gunfighter5.src = "/images/gunfighter5.png";

var gunfighter6 = new Image();
gunfighter6.src = "/images/gunfighter6.png";

var gunfighter7 = new Image();
gunfighter7.src = "/images/gunfighter7.png";

var gunfighter8 = new Image();
gunfighter8.src = "/images/gunfighter8.png";

var gunfighter9 = new Image();
gunfighter9.src = "/images/gunfighter9.png";

var gunfighter10 = new Image();
gunfighter10.src = "/images/gunfighter10.png";

var gunfighter11 = new Image();
gunfighter11.src = "/images/gunfighter11.png";

var gunfighter12 = new Image();
gunfighter12.src = "/images/gunfighter12.png";

var gunfighters= [gunfighter, gunfighter2, gunfighter3, gunfighter4, gunfighter5,
                    gunfighter6, gunfighter7, gunfighter8, gunfighter9, gunfighter10,
                    gunfighter11, gunfighter12];
var canvas = document.getElementById("gamespace");
$('#gamespace').focus();
canvas.onmouseup = function(event) {mouseClick(event)};
var context = canvas.getContext("2d");

var notice = new component("60px", "wildbunch", "#8B0000", canvasWidth/2, canvasHeight/2 +160, "text-centered");

var toType = new component("17px", "Consolas", "grey", 20, 640, "text");
var haveTyped = new component("17px", "Consolas", "red", 20, 640, "text");
var cursor = new component("17px", "Consolas", "red", 20, 640, "text");

var opponentType = new component("17px", "Consolas", "grey", canvasWidth/2 + 20, 640, "text");
var opponenthasTyped = new component("17px", "Consolas", "red", canvasWidth/2 + 20, 640, "text");

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
    if(!loggedin) {
        logon();
    }
};


socket.on('receive user id', function(msg){
    userid = msg;
});

socket.on('gunfighter update', function(index){
    opponentgunfighterindex = index;
});

socket.on('opponent win', function(){
    winner = true;
    notice.text = opponentName + ' has won!'
    audio.play();
    newGame = false;
    clearInterval(canvas.interval);
    setTimeout(restart, 4000);
    socket.emit('update after game');
});

socket.on('you have been challenged', function(msg, name){
    if (confirm('new challenge ' + name)) {
        socket.emit("accept challenge", msg, name);
    } else {
        socket.emit('denied challenge', msg);
    }
});

socket.on('challenge accepted', function(msg, name) {
    $('#gamespace').focus();
    opponentName = name;
    opponentid = msg;
    newGame = true;
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

socket.on('log in success', function() {
    loggedin = true;
    username = userinput._value;
    userinput.destroy();
    password.destroy();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
   
    loginButton.flag = false;
});
function restart() {
    loggedin = true;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
}
socket.on('update users', function(msg) {
    var usersUl = document.getElementById("users");
    var body = document.getElementById('index');
    var placeholder = document.getElementById('placehoder');
    usersUl.innerHTML = '';
    for (let user of msg) {
        if(user.uid == userid || newGame  || !loggedin) {
            var li = document.createElement('li');
            li.setAttribute('class', 'list-group-item');
            var userList = document.createTextNode(user.name);
            li.appendChild(userList);
            usersUl.appendChild(li);
        } else {
            var userModal = createModal(user);
            body.insertBefore(userModal, placeholder);
            var li = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', ('#challenge'+ user.uid));
            link.setAttribute('data-toggle', 'modal');
            li.setAttribute('class', 'list-group-item');
            
            var userList = document.createTextNode(user.name);
            link.appendChild(userList);
            li.appendChild(link);
            usersUl.appendChild(li);
        }
    }
});

function createModal(user) {
    var userModal = document.createElement('div');
    userModal.setAttribute("class", "modal fade");
    userModal.setAttribute("id", ("challenge" + user.uid));
    userModal.setAttribute("role", "dialog");
    var modalDialog = document.createElement('div');
    modalDialog.setAttribute("class", "modal-dialog");
    var modalContent = document.createElement('div');
    modalContent.setAttribute("class", "modal-content");
    var modalHeader = document.createElement('div');
    modalHeader.setAttribute('class', 'modal-header');
    var h4 = document.createElement('h4');
    h4.setAttribute('style', 'color:red;');
    var h4Text = document.createTextNode('CHALLENGE: ' + user.name);
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
        socket.emit('challenge', user.uid);
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
    cursor.text = "_";
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
    // divide by 11 because there are 12 frames to the gunfighter gif
    characterDivision = Math.floor(characterArray.length / 11);
    notice.text = "3";
    countdown = true;
    startSeconds = 0;
    seconds = 0;
    setInterval(incSeconds, 1000);
    canvas.interval = setInterval(updateGameArea, 20);
}

function incSeconds() {
    seconds++;
}
function signIn() {
    socket.emit("sign in", userinput._value, passwordText);
}

function mouseClick(e) {
    mouse.x = e.pageX - $('#gamespace').offset().left;
    mouse.y = e.pageY - $('#gamespace').offset().top;
    if(loginButton.flag && mouse.x > loginButton.xpos && mouse.x < loginButton.width + loginButton.xpos){
        if(mouse.y > loginButton.ypos && mouse.y < loginButton.height + loginButton.ypos){
            signIn();
        }
    }
}
window.onkeyup = function(e) {
    keyPressed = e.keyCode;
    if(password._hasFocus) {
        if (keyPressed == 13) {
            signIn();
        }
        else if (keyPressed == 8) {
            passwordText = passwordText.substring(0, passwordText.length -1);
        }
        else if (keyPressed == 16) {
          //do nothing ignoring shift key
        }
        else if(password._value.length > 0) {
            passwordText += password._value[password._value.length -1];
            password.value(password.value().substring(0, password.value().length -1) + String.fromCharCode(0x25CF));
        } 
        console.log(passwordText);
    }
};
window.onkeydown = function(e) {
    
    keyPressed = e.key;
    if(newGame && !winner && (startSeconds + 3 == seconds || !countdown)) {
        if (keyPressed == characterArray[correctKeyIndex]) {
            if(keyPressed == "Enter" ) {
                keyPressed = "\n";
                haveTyped.text = "";
                cursor.text = "_";
                toType.text = toType.text.slice(toType.text.indexOf("\n") +1 , toType.text.length);
               
            } else {
                haveTyped.text = haveTyped.text + keyPressed;
                cursor.text = " " + cursor.text;
            }
            socket.emit('have typed', haveTyped.text, opponentid);
            socket.emit('to type', toType.text, opponentid);
            
            correctKeyIndex++;
            changedimage = false;
        }
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
        } else if (this.type == "text-centered") {
            context.font = this.width + " " + this.height;
            context.fillStyle = color;
            context.textAlign = "center";
            context.fillText(this.text, this.x, this.y);
            context.textAlign = "left";
        
        }else {
            context.fillStyle = color;
            context.strokeStyle = this.type;
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.fillRect(this.x, this.y, this.width, this.height);
            
        }
    };
}


function logon() {
    context.globalAlpha = 0.7;
    context.drawImage(logonImage, 0, 0, canvasWidth, canvasHeight);
    context.globalAlpha = 1;
    userinput = new CanvasInput({
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
    password = new CanvasInput({
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
    context.drawImage(loginButton, loginButton.xpos, loginButton.ypos, loginButton.width, loginButton.height);
    loginButton.flag = true;
}

function updateGameArea() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    frameNo += 1;
    if (countdown) {
        if (startSeconds + 1 == seconds) {
            notice.text = "2";
        }
        else if (startSeconds + 2 == seconds) {
            notice.text = "1";
        }
        else if (startSeconds + 3 == seconds) {
            notice.text = "TYPE!";
        }
        else if (startSeconds + 4 == seconds) {
            countdown = false;
        }
    }
    
    context.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight -200);
    
    if (!changedimage && (correctKeyIndex +1) % characterDivision == 0) {
        if(gunfighterindex < 9) {
            changedimage = true;
            gunfighterindex++;
            socket.emit('update gunfighter', gunfighterindex, opponentid);
        }
    }
    if (correctKeyIndex == characterArray.length && !winner) {
        gunfighterindex = 10;
        winner = true;
        socket.emit('update gunfighter', gunfighterindex, opponentid);
        socket.emit("win", opponentid);
        audio.play();
        notice.text = "You have won!";
        clearInterval(canvas.interval);
        setTimeout(restart, 4000);
        newGame = false;
    }
    
    context.drawImage(gunfighters[gunfighterindex], 30, 300, canvasWidth/3, canvasHeight/3);
    flipHorizontally(gunfighters[opponentgunfighterindex], canvasWidth/3, canvasHeight/3, 600, 300);
    
    myRect.update();
    player1Rect.update();
    player2Rect.update();
    
    if (winner || countdown) { 
        notice.update();
    }
    toType.update();
    haveTyped.update();
    if (frameNo % 30 < 15) {
        cursor.update();
    }
    opponentType.update();
    opponenthasTyped.update();
}

function flipHorizontally(img, width, height, x,y){
    // move to x + img's width
    context.translate(x+width,y);

    // scaleX by -1; this "trick" flips horizontally
    context.scale(-1,1);
    
    // draw the img
    // no need for x,y since we've already translated
    context.drawImage(img,0,0, width, height);
    
    // always clean up -- reset transformations to default
    context.setTransform(1,0,0,1,0,0);
}