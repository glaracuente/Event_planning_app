// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var userEvent = {
  allUsers: function(cb) {
    orm.all("users", function(res) {
      cb(res);
    });
  },
  allEvents: function(cb) {
    orm.all("events", function(res) {
      cb(res);
    });
  },
  user: function(id, cb) {
    orm.user(id, function(res) {
      cb(res);
    });
  },
  event: function(id, cb) {
    orm.event(id, function(res) {
      cb(res);
    });
  },
  getUsersEvents: function(id, cb) {
    orm.getUsersEvents(id, function(res) {
      cb(res);
    });
  },
  getVotesForSingleEvent: function(eventID, cb) {
    orm.getVotesForSingleEvent(eventID, function(res) {
      cb(res);
    });
  },
  getVotesForEvent: function(eventid, cb) {
    orm.getVotesForEvent(eventid, function(res) {
      cb(res);
    });
  },

  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("events", cols, vals, function(res) {
      cb(res);
    });
  },
  createVote: function(voteData, userid, eventid, cb) {
    orm.createVote(voteData, userid, eventid, function(res) {
      cb(res);
    });
  },
  update: function(newTitle, condition, cb) {
    orm.update("events", newTitle, condition, function(res) {
      cb(res);
    });
  },
  updateEvent: function(newData, condition, cb) {
    orm.updateEvent(newData, condition, function(res) {
      cb(res);
    });
  },
  delete: function(condition, cb) {
    orm.delete("events", condition, function(res) {
      cb(res);
    });
  },
  deleteVote: function(userid, eventid) {
    orm.deleteVote(userid, eventid);
  },
};

// Export the database functions for the controller.
module.exports = userEvent;
