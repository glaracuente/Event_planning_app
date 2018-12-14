// Function for calendar
$(function () {
  $("#datepickerS").datepicker();
});

$(function () {
  $("#datepickerE").datepicker();
});

// ======================================================================

// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {

  function renderCheckboxes() {
    console.log("render checkboxes")
    for (var x = 0; x < 100; x++) {
      var divname = "#date_box_div_" + x;

      if ($(divname).length === 0) {
        continue;
      }
      var thisdiv = $(divname)
      var from = thisdiv.data('fromdate').split('/')[1]
      var to = thisdiv.data('todate').split('/')[1]

      from = parseInt(from)
      to = parseInt(to)

      var checkboxesArray = [];
      for (var i = from; i <= to; i++) {
        var checkbox = $("<div>")
        checkbox.html('<input type="checkbox" name="vote" value="' + i + '">' + i)
        checkboxesArray.push(checkbox)
      }

      for (var i = 0; i < checkboxesArray.length; i++) {
        thisdiv.prepend(checkboxesArray[i])
      }
    }
  }

  function tallyVotes() {
    console.log("tally votes")

    var allDates = [];
    for (var x = 0; x < 100; x++) { //NEED TO CHANGE TO REALLY KNOW THE EVENTIDS AND USE THEM
      var divname = "#user_" + x;

      if ($(divname).length === 0) {
        continue;
      }
      var thisdiv = $(divname)
      var dates = thisdiv.data('dates')

      allDates = allDates.concat(dates)
    }

    var votes = {};

    for (var i = 0; i < allDates.length; ++i) {
      if (!votes[allDates[i]])
        votes[allDates[i]] = 0;
      ++votes[allDates[i]];
    }

    for (var key in votes) {
      var div = $("<div>").text(key + "th: " + votes[key] + " people")
      $("#voteResults").append(div)
    }
  }




  $(document).on("click", ".login", function (event) {
    console.log("login clicked")
    var id = $(this).data("id");

    $.ajax("/userpage/" + id, {
      type: "GET"
    }).then(
      function () {
        console.log("Logging in as " + id);
      }
    );

    window.location.href = '/userpage/' + id
  });

  $(document).on("click", ".vote_button", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var id = $(this).data("id");

    $.ajax("/vote/" + id, {
      type: "GET",
      data: id
    }).then(
      function () {
        console.log("Taking user to vote page...");
        window.location.href = '/vote/' + id


      }
    );
  });

  $(".update-form").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var id = $(this).data("id");

    var newtitle = {
      title: $("#newTitle").val().trim(),
    };

    $.ajax("/event/" + id, {
      type: "PUT",
      data: newtitle
    }).then(
      function () {
        console.log("updating event " + id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  // ==========================================================
  $(".submit-vote").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var arrayOfDates = [];
    $("input:checkbox[name=vote]:checked").each(function () {
      arrayOfDates.push($(this).val());
    });

    var dates = JSON.stringify(arrayOfDates)
    var eventid = $(".submit-vote").data('eventid')
    var userid = $(".submit-vote").data('userid')

    var vote = {
      votes: dates
    };

    $.ajax("/vote/" + userid + "/" + eventid, {
      type: "PUT",
      data: vote
    }).then(
      function () {
        console.log("User " + userid + " is voting on event " + eventid);
        // Reload the page to get the updated list
        //location.reload();
      }
    );


  });

  // ==========================================================
 


  $(".form-check-input:checkbox:checked").each(function () {
    newEvent.invites.push($(this).val());
    console.log(newEvent.invites);

    // Send the POST request.
    $.ajax("/api/create_event/" + id, {
      type: "POST",
      data: newEvent
    }).then(
      function () {
        console.log("Event created");
        // Reload the page to get the updated list

      }
    );
  });


  $(".createE").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    var id = $(".currentUser").data("id");

    console.log(id);



    var newEvent = {
      title:$("#event").val().trim(),
      from_date: $(".startDate").val().trim(),
      to_date:$(".endDate").val().trim(),
      invites:[]
    };


   $(".form-check-input:checkbox:checked").each(function(){ newEvent.invites.push($(this).val()); });
   console.log(newEvent.invites);

    // Send the POST request.
    $.ajax("/api/create_event/"+ id, {
      type: "POST",
      data: newEvent
    }).then(
      function() {
        console.log("Event created");
        // Reload the page to get the updated list

      }
    );
  });

  // =========================================================
  $("#new_event").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var id = $("#currentUser").data("id")
    console.log(id)

    $.ajax("/new_event/" + id, {
      type: "GET",
      data: id
    }).then(
      function () {
        console.log("Ready to create event");

        window.location.href = '/new_event/' + id
      }
    );
  });


  // ==========================================================

  $(document).on("click", ".deleteEvent", function (event) {
    console.log("delete event clicked")
    var id = $(this).data("id");

    $.ajax("/event/" + id, {
      type: "DELETE"
    }).then(
      function () {
        console.log("Deleting event " + id);
      }
    );

    location.reload()
  });

  renderCheckboxes()     //NEED TO MAKE THIS ONLY RUN WHEN VOTE PAGE LOADS
  tallyVotes()

});
