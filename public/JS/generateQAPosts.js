//It is assumed that the file using this has a controller.js reference

function getAllPosts(){
  app.controller('myCtrl', function($scope, $http) {
  $http.put('./routes/qa_posts')
    .then(function(response) {
        alert(response.data);
    });
  });

}

//getAllPosts();
