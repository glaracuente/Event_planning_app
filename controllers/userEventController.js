// Requiring our userEvent and passport as we've configured it
var passport = require("../config/passport");
var userEvent = require("../models/userEvent");
var userInfo;

module.exports = function (app) {


  function auth(req, res, next, authMethod) {
    passport.authenticate(authMethod, function (err, user, info) {
      if (err) {
        res.status(500)
        res.json(err)
      }
      if (!user) {
        res.status(401)
        res.json(info.message);
      }
      else {
        req.logIn(user, function (err) {
          if (err) { return next(err); }
          userInfo = req.body;
          res.status(200)
          res.json("/members");
        });
      }
    })(req, res)
  }

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", function (req, res, next) {
    auth(req, res, next, "local-login")
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res, next) {
    auth(req, res, next, "local-signup")
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    userInfo = 0;
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send to home page
      res.redirect("/");
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // ======================================================================================================================================
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render("signup");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    userEvent.selectWhere("username",userInfo.email,function(err,rows){
      var name = rows[0].username.split("@");
      userEvent.getUsersEvents(rows[0].id, function (myevents) {

        var invitedEventIDs = [];
        userEvent.allEvents(function (data) {
    
          data.forEach(function (event) {
            if (event.invites.indexOf(rows[0].id) !== -1) {
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
    
                thisinvitedEventArray = [currentEventTitle, currentEventID, voteString, rows[0].id]
                invitedEventsArray.push(thisinvitedEventArray)
    
                userEventsObj = {
                  myEvents: myevents,
                  userid: rows[0].id,
                  invitedEvents: invitedEventsArray,
                  username:name[0]
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
    })
  
  });

  // ======================================================================================================================================
 
  
  
  // ======================================================================================================================
  
  app.post("/api/create_event", function (req, res) {
    userEvent.create([
      "userid", "title", "from_date", "to_date", "invites"
    ], [
      req.body.id, req.body.title, req.body.from_date, req.body.to_date, JSON.stringify(req.body.invites)
      ], function (result) {
        res.json({ id: result.insertId });
      })
  
  });
  
  // ============================================================================================================================
  app.get("/new_event/:id", function (req, res) {
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
          var othersName = data[i].username.split("@")[0]
          data[i].username = othersName
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
  app.get("/vote/:userid/:eventid", function (req, res) { //Fifer button needs to ref this link
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
  
  app.put("/vote/:userid/:eventid", function (req, res) {
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
  
  
  app.get("/votes/:eventid", function (req, res) {
    userEvent.getVotesForEvent(req.params.eventid, function (data) {
      var votes = {
        votes: data,
        eventid: req.params.eventid
      }
      res.render("votes", votes)
    });
  });
  
  app.put("/event/:id", function (req, res) {
    console.log(req.body)
    userEvent.updateEvent(req.body.title, req.params.id, function (result) {
      if (result.changedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    });
  });
  
  app.delete("/event/:id", function (req, res) {
    userEvent.delete(req.params.id, function (result) {
      if (result.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    });
  });
};


// ===============================
// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = function (req, res, next){
  
  if (req.user) {
    return next();
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect("/");
}



  

