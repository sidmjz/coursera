// Event handling
document.addEventListener("DOMContentLoaded",
  function (event) {

    // Unobtrusive event binding
    document.querySelector("button")
      .addEventListener("click", function () {
        var self = this;

        // Call server to get the name

        $ajaxUtils
          .sendGetRequest("data/name.json", 
            function (resObj) {
              var message = resObj.firstName + " " + resObj.lastName;

              if (resObj.likesChineseFood) {
                message += " likes Chinese Food";
              } else {
                message += " doesn't like Chinese Food"
              }
              message += (" and use " + (resObj.numberOfDisplays+1) + " displays for learning.");  
              
              document.querySelector("#content")
              .innerHTML = "<h2>" + message + "!</h2>";
            });

          
      });
  }
);




