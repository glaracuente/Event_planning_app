// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(document).on("click", ".login", function(event) {
    console.log("login clicked")
    var id = $(this).data("id");

    $.ajax("/userpage/" + id, {
      type: "GET"
    }).then(
      function() {
        console.log("Logging in as " + id);
      }
    );
    
    window.location.href='/userpage/' + id
  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newCat = {
      name: $("#ca").val().trim(),
      sleepy: $("[name=sleepy]:checked").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/cats", {
      type: "POST",
      data: newCat
    }).then(
      function() {
        console.log("created new cat");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $(".delete-cat").on("click", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/cats/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted cat", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
});
