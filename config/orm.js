// Import MySQL connection.
var connection = require("../config/connection.js");

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  var arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
      // e.g. {sleepy: true} => ["sleepy=true"]
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}




// Object for all our SQL statement functions.
var orm = {
  all: function (tableInput, cb) {
    var queryString = "SELECT * FROM " + tableInput + ";";
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  user: function (idInput, cb) {
    var queryString = "SELECT * FROM users WHERE id = " + idInput + ";";
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  event: function (idInput, cb) {
    var queryString = "SELECT * FROM events WHERE id = " + idInput + ";";
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  getVotesForSingleEvent: function (eventID, cb) {
    var queryString = "SELECT e.id,title,dates FROM events as e JOIN votes as v on e.id = v.eventid WHERE e.id = " + eventID + ";";
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  getVotesForEvent: function (eventid, cb) {
    var queryString = "SELECT * FROM votes WHERE eventid = " + eventid + ";";
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  getUsersEvents: function (idInput, cb) {
    var queryString = "SELECT * FROM users as u JOIN events as e on u.id = e.userid WHERE u.id = " + idInput + ";";

    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  create: function (table, cols, vals, cb) {
    var queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    console.log(queryString);

    connection.query(queryString, vals, function (err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  createVote: function (voteData, userid, eventid, cb) {
    var queryString = "INSERT INTO votes (userid, eventid, dates)";
    queryString += " VALUES(" + userid;
    queryString += ", " + eventid;
    queryString += ", '" + voteData.votes;
    queryString += "');"

    console.log(queryString); 


    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  update: function(table, objColVals, eventID, cb) {
    var queryString = "UPDATE " + table;
    queryString += " SET "; 
    queryString += objToSql(objColVals);
    queryString += " WHERE id=";
    queryString += eventID;

    console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  // An example of objColVals would be {name: panther, sleepy: true}
  updateEvent: function (newTitle, eventId, cb) {
    var queryString = "UPDATE events";
    queryString += " SET title="; 
    queryString += "'" + newTitle + "'";
    queryString += " WHERE id=";
    queryString += eventId;

    console.log(queryString);
    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  delete: function (table, condition, cb) {
    var queryString = "DELETE FROM " + table;
    queryString += " WHERE id =";
    queryString += condition;

    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  deleteVote: function (userid, eventid) {
    var queryString = "DELETE FROM votes";
    queryString += " WHERE userid = " + userid;
    queryString += " AND eventid = " + eventid;
    console.log(queryString);

    connection.query(queryString, function (err, result) {
      if (err) {
        throw err;
      }
    });
  }
};

// Export the orm object for the model (cat.js).
module.exports = orm;
