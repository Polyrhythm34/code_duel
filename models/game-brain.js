'use strict';

const scripts = require('./script-m');


var numUsers = 0;
var users = [];
//part of the matchmaking()

exports.randomScript = () => {
    return scripts.allScripts()
    .then((scriptsArray) => {
        var randomScript = Math.floor(Math.random() * scriptsArray.length);
        return scriptsArray[randomScript].code;
    });
};

exports.userConnect = (id) => {
    users.push(id);
    numUsers++;
    return numUsers;
};

exports.userDisconnect = (id) => {
    users.splice(users.indexOf(id), 1);
    numUsers--;
    return numUsers;
};

exports.getUsers = () => {
    return users;
};