// Function for calendar
$( function() {
  $( "#datepickerS" ).datepicker();
} );

$( function() {
  $( "#datepickerE" ).datepicker();
} );

// ======================================================================

// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {
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

  $(".update-form").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var id = $(this).data("id");

    var newtitle = {
      title: '"' + $("#newTitle").val().trim() + '"',
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
  $("#new_event").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

     var id = $("#currentUser").data("id")
  
    $.ajax("/new_event/" + id, {
      type: "GET",
      data:id
    }).then(
      function() {
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
});
