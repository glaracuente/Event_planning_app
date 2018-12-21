

$(document).ready(function() {
  
  handleLoginSugnup("form.login", "/api/login")

});

$(document).ready(function() {
    handleLoginSugnup("form.signup", "/api/signup")
  });


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
    for (var x = 0; x < 100; x++) { //NEED TO CHANGE TO REALLY KNOW THE EVENTIDS AND USE THEM
      var divname = "#date_box_div_" + x;

      if ($(divname).length === 0) {
        continue;
      }
      var thisdiv = $(divname)
      var fromDay = parseInt(parseInt(thisdiv.data('fromdate').split('/').slice(1, 2)))
      var toDay = parseInt(parseInt(thisdiv.data('todate').split('/').slice(1, 2)))
      var month = parseInt(thisdiv.data('fromdate').split('/').slice(0, 1))

      from = parseInt(fromDay)
      to = parseInt(toDay)

      var checkboxesArray = [];
      for (var i = from; i <= to; i++) {
        var checkbox = $("<div>")
        checkbox.html('<input type="checkbox" name="vote" value="' + month + '.' + i + '">' + month + '.' + i)
        checkboxesArray.push(checkbox)
      }

      for (var i = 0; i < checkboxesArray.length; i++) {
        thisdiv.prepend(checkboxesArray[i])
      }
    }
  }

  function formatDateVotes() {
    for (var x = 0; x < 100; x++) { // AJAX CALLLLLLL!!! NEED TO CHANGE TO REALLY KNOW THE EVENTIDS AND USE THEM
      var divtest = "#displayedVoteData_" + x;

      if ($(divtest).length === 0) {
        continue;
      }

      var votedata = $("#displayedVoteData_" + x).text()
      $("#displayedVoteData_" + x).text("")
      var votesArray = votedata.split(';')

      votesArray.forEach(function (dateAndVotes) {
        var date = dateAndVotes.split(":")[0]
        var votes = dateAndVotes.split(":")[1]
        var max = 3;
        var progressWidth = (votes / max) * 100
       
        var dateDiv = $("<div>").text(date)
        var tempDiv = $("<div>").addClass("progress")
        var progDiv = $("<div>").addClass("progress-bar").attr("role", "progressbar").attr( "aria-aria-valuemin", "0").attr( "aria-valuemax", max).attr( "aria-valuenow", votes).attr( "style", "width: " + progressWidth + "%"); 
        tempDiv.append(progDiv)
        $("#displayedVoteData_" + x).append(dateDiv).append(tempDiv)
      });
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
      var div = $("<div>").text(key + ":" + votes[key])
      $("#voteResults").append(div)
    }
  }




  

  $(document).on("click", ".vote_button", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var userid = $(this).data("userid")
    var eventid = $(this).data("eventid")

    //$.ajax("/vote/" + userid + "/" + eventid, {
    //  type: "GET",
    //  data: id
    //}).then(
    //  function () {
    console.log("Taking user to vote page...");
    window.location.href = '/vote/' + userid + "/" + eventid;
    //  }
    //);
  });

  $(".update-form").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    
    var id = $(this).data("id");


    var newTitle = {
      title: $("#newTitle_" + id).val().trim().toString(),
    }

    if (newTitle.title.length < 5) {
      alert("ERROR: Event title much be at least 5 characters.");
    }
    else {
      $.ajax("/event/" + id, {
        type: "PUT",
        data: newTitle
      }).then(
        function () {
          console.log("updating event " + id);
          // Reload the page to get the updated list
          location.reload();
        }
      );
    }
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
        window.location.href = '/members'
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


  $(".createE").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var id = $(".currentUser").data("id");


    var newEvent = {//NEED TO VALIDATE HERE
      title: $("#event").val().trim(),
      from_date: $(".startDate").val().trim(),
      to_date: $(".endDate").val().trim(),
      invites: []
    };

    if (newEvent.from_date.indexOf("/") === -1 || newEvent.to_date.indexOf("/") === -1) {
      alert("ERROR: A date is missing");
    } else if (newEvent.from_date > newEvent.to_date) {
      alert("ERROR: The dates are not in order.");
    } else if (newEvent.title.length < 5) {
      alert("ERROR: Event title much be at least 5 characters.");
    } else {
      $(".form-check-input:checkbox:checked").each(function () { newEvent.invites.push($(this).val()); });
      if (newEvent.invites.length === 0) {
        alert("ERROR: No one was invited");
      }
      else {
        // Send the POST request.
        $.ajax("/api/create_event", {
          type: "POST",
          data: newEvent
        }).then(
          function () {
            console.log("Event created");
            console.log(id);
            window.location.href = '/members'
          }
        );
      }
    };
  });

  // =========================================================
  $("#new_event").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var id = $("#currentUser").data("id")
    console.log(id)

    //$.ajax("/new_event/" + id, {
    //  type: "GET",
    //  data: id
    //}).then(
    //  function () {
    console.log("Ready to create event");

    window.location.href = '/new_event'
    //  }
    //);
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
  formatDateVotes()

});

function handleLoginSugnup(form, url) {
  var form = $(form);
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the form is submitted, we validate there's an email and password entered
  form.on("submit", function (event) {
      event.preventDefault();
      $(".container").hide();
      var userData = {
          email: emailInput.val().trim(),
          password: passwordInput.val().trim()
      };

      if (!userData.email || !userData.password) {
          return;
      }

      // If we have an email and password we run the authUser function and clear the form
      authUser(userData.email, userData.password);
      emailInput.val("");
      passwordInput.val("");
  });

  // AUTHUser does a post to the url and if successful, redirects us the the members page
  function authUser(email, password) {
      $.post(url, {
          email: email,
          password: password
      }).then(function (data) {
          window.location.replace(data);
          // If there's an error, log the error
      }).catch(handleAuthErr);
  }

  function handleAuthErr(err) {
      $(".container").show();
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
  }
}




