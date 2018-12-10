// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var userEvent = {
  allUsers: function(cb) {
    orm.all("users", function(res) {
      cb(res);
    });
  },
  user: function(id, cb) {
    orm.user(id, function(res) {
      cb(res);
    });
  },
  getUsersEvents: function(id, cb) {
    orm.usersEvents(id, function(res) {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("cats", cols, vals, function(res) {
      cb(res);
    });
  },
  update: function(newTitle, condition, cb) {
    orm.update("events", newTitle, condition, function(res) {
      cb(res);
    });
  },
  delete: function(condition, cb) {
    orm.delete("events", condition, function(res) {
      cb(res);
    });
  }
};

// Export the database functions for the controller.
module.exports = userEvent;
