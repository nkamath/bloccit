const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

 edit() {
   return this._isOwner() || this._isAdmin();
 }

 update() {
   return this._isOwner() || this._isAdmin();
 }

 destroy() {
   return this._isOwner() || this._isAdmin();
 }
}
