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
