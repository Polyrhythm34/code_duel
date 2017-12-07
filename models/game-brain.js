'use strict';
const scripts = require('./script-m');
const usersdb = require('./user-m');


var numUsers = 0;
var users = [];
class GUser {
    constructor(name, uid) {
        this.name = name;
        this.uid = uid;
    }
};
//part of the matchmaking()

exports.randomScript = () => {
    return scripts.allScripts()
    .then((scriptsArray) => {
        var randomScript = Math.floor(Math.random() * scriptsArray.length);
        return scriptsArray[randomScript].code;
    });
};

exports.userConnect = (username, password, id) => {
    return usersdb.allUsers()
    .then((usersArray) => {
        for (let currentUser of usersArray) {
            if (currentUser.username == username) {
                if (currentUser.password == password) {
                    var user = new GUser(username, id);
                    users.push(user);
                    numUsers++;
                    return true;
                } 
            }
        }
        return false;
       
    });
};

exports.userDisconnect = (id) => {
    var result = findObjectByKey(users, "uid", id);
    users.splice(users.indexOf(id), 1);
    numUsers--;
    return numUsers;
};

exports.getUsers = () => {
    return users;
};

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}