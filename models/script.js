'use strict';
module.exports = class Script {
   constructor(code, id) {
      if (id) {
         this._id = id;
      }
      this.code = code;
   }
};