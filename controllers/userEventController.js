var express = require("express");

var router = express.Router();

// Import the model (cat.js) to use its database functions.
var userEvent = require("../models/userEvent.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
  userEvent.allUsers(function (data) {
    //console.log(data);
    res.render("index", { users: data });
  });
});

router.get("/userpage/:id", function (req, res) {
  userEvent.getUsersEvents(req.params.id, function (data) {
    var userEventsObj = {
      allEvents: data,
      singleUserEvent: data[0]
    }
    //console.log(userEventsObj);
    res.render("userPortal", userEventsObj);
  });
});

// ======================================================================================================================

router.post("/api/create_event/:id", function (req, res) {
  userEvent.create([
    "userid", "title", "from_date", "to_date"
  ], [
      req.params.id, req.body.title, req.body.from_date, req.body.to_date
    ], function (result) {
      res.json({ id: result.insertId });
    });
});

// ============================================================================================================================
router.get("/new_event/:id", function (req, res) {
  userEvent.user(req.params.id, function (result) {

    var currentUser = {
      id: result[0].id,
      name: result[0].name
    }

    res.render("create", currentUser)
  })
});

// ============================================================================================================================
router.get("/vote/:userid/:eventid", function (req, res) { //Fifer button needs to ref this link
  userEvent.event(req.params.eventid, function (data) {
    var voteObj = {
      event: data[0],
      userid: req.params.userid,
    }

    res.render("vote", voteObj)
  });
});

// ============================================================================================================================

router.put("/vote/:userid/:eventid", function (req, res) {
  userEvent.deleteVote(req.params.userid, req.params.eventid);

  userEvent.createVote(req.body, req.params.userid, req.params.eventid, function (result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

router.delete("/event/:id", function (req, res) {
  userEvent.delete(req.params.id, function (result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// Export routes for server.js to use.
module.exports = router;
