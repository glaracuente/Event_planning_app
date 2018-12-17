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
  userEvent.getUsersEvents(req.params.id, function (myevents) {

    var invitedEventIDs = [];
    userEvent.allEvents(function (data) {

      data.forEach(function (event) {
        if (event.invites.indexOf(req.params.id) !== -1) {
          invitedEventIDs.push([event.id, event.title])
        }
      })

      var counter = 0
      var invitedEventsArray = []
      var userEventsObj;

      invitedEventIDs.forEach(function (eventInfo) {
        userEvent.getVotesForSingleEvent(eventInfo[0], function (votedata) {
          if (counter < invitedEventIDs.length) {
            var currentEventID = eventInfo[0]
            var currentEventTitle = eventInfo[1]


            var allDates = [];
            votedata.forEach(function (singleUserVoteData) {
              //console.log("<<<<<" + singleUserVoteData.title + ">>>>>>")
              currentEventTitle = singleUserVoteData.title
              allDates = allDates.concat(JSON.parse(singleUserVoteData.dates))
            });

            var votes = {};

            for (var i = 0; i < allDates.length; ++i) {
              if (!votes[allDates[i]])
                votes[allDates[i]] = 0;
              ++votes[allDates[i]];
            }

            voteString = ""
            for (var key in votes) {
              voteString = voteString + key + ":" + votes[key] + ';'
            }

            thisinvitedEventArray = [currentEventTitle, currentEventID, voteString, req.params.id]
            invitedEventsArray.push(thisinvitedEventArray)

            userEventsObj = {
              myEvents: myevents,
              userid: req.params.id,
              invitedEvents: invitedEventsArray
            }

            counter++; //SUUUPER HACKY

            if (counter === invitedEventIDs.length) {
              console.log(userEventsObj)

              res.render("userPortal", userEventsObj);
            }
          }
        });
      });
    });
  });
});

// ======================================================================================================================

router.post("/api/create_event/:id", function (req, res) {
  userEvent.create([
    "userid", "title", "from_date", "to_date", "invites"
  ], [
      req.params.id, req.body.title, req.body.from_date, req.body.to_date, JSON.stringify(req.body.invites)
    ], function (result) {
      res.json({ id: result.insertId });
    })

});

// ============================================================================================================================
router.get("/new_event/:id", function (req, res) {
  userEvent.allUsers(function (data) {
    var userIdStr = req.params.id;
    var userIdInt = parseInt(userIdStr, 10);

    var users = {
      currentUser: [],
      others: []

    }

    for (i = 0; i < data.length; i++) {

      if (data[i].id === userIdInt) {
        users.currentUser.push(data[i])


      }

      else {
        users.others.push(data[i]);
      }
    }

    var pasthis = {
      current: users.currentUser[0],
      others: users.others

    }


    res.render("create", pasthis);
  });
});

// ============================================================================================================================
router.get("/vote/:userid/:eventid", function (req, res) { //Fifer button needs to ref this link
  userEvent.event(req.params.eventid, function (data) {
    var voteObj = {
      event: data[0],
      userid: req.params.userid,
    }
    console.log(voteObj)
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


router.get("/votes/:eventid", function (req, res) {
  userEvent.getVotesForEvent(req.params.eventid, function (data) {
    var votes = {
      votes: data,
      eventid: req.params.eventid
    }
    res.render("votes", votes)
  });
});

router.put("/event/:id", function (req, res) {
  userEvent.update({
    title: req.body.title
  }, req.params.id, function (result) {
    if (result.changedRows == 0) {
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
