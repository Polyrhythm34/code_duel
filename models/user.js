'use strict';
module.exports = class User {
   constructor(username, password, id) {
      if (id) {
         this._id = id;
      }
      this.username = username;
      this.password = password;
   }
};