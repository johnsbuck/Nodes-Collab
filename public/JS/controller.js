var app = angular.module('nodesConnect', []);

app.controller('newUserCtrl', function($scope, $http) {

  $scope.sub = function() {
      console.log($scope.formData);
      $http.put('/user/create', $scope.formData).
      success(function(data) {
          console.log('Sent to sever successfully.');
      }).error(function(data){
          console.log('ERROR: Not sent to server.');
      });
    }
});

app.controller('loginCtrl', function($scope, $http, $location) {
  $scope.sub = function() {
    console.log($scope.formData);
    console.log($http.defaults.headers.common);
    $http.put('/login', $scope.formData).
    success(function(data) {
      console.log($scope.formData);
      $http.put('/user/get', $scope.formData).success(function(data) {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('email', $scope.formData.email);
        sessionStorage.setItem('password', $scope.formData.pass);

        window.location.replace('main.html' , 'Signin.html');
        console.log('Sent to sever successfully.');
      }).error(function(data) {
        console.log('Unable to receive user info.');
      });
    }).error(function(data){
        console.log('ERROR: Not sent to server.');
    });
  }

  $scope.init = function() {
    if(sessionStorage.getItem('username') && sessionStorage.getItem('email') && sessionStorage.getItem('password')) {
      $scope.formData = {
        email: sessionStorage.getItem('email'),
        pass: sessionStorage.getItem('password')
      };

      $scope.sub($scope.formData);
    $scope.sub = function() {
        console.log($scope.formData);
        $http.post('/login', $scope.formData).
        success(function(data) {
          window.location.replace('main.html' , 'Signin.html');
            console.log('Sent to sever successfully.');
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
    }
  };
}});

app.controller('settingsCtrl', function($scope, $http) {
  $scope.sub = function() {
    $http.put('' , $scope.formData)
    success(function(data) {
      console.log('Sent to the server successfully.');
    }).error(function(data) {
      console.log('ERROR: Not sent to server.');
    });
  }
});

app.controller('mainCtrl', function($scope, $http) {
  $scope.message = "Welcome back, " + sessionStorage.getItem('username');
});
/*
* Controller for the user profile page.
**/
app.controller('profileCtrl', function($scope, $http) {
  //Here we need to fill all the data for the fields in the HTML.
  $scope.username = "" + sessionStorage.getItem('username');    //get the username for the current user from sessionStorage (after all we already have it)
  //get all the user information from the DB
  $http.put('/user/get', $scope.formData).success(function(data) {
    //set further fields in the HTML here
    $scope.about_text = data.about_text;    //about text retreived from the db
    $scope.karma = data.karma;              //amount of karma the current user has.
    //TODO: other stuff to add here: languages known, etc.
    console.log('Successfully retrieved user info from server.');
  }).error(function(data) {
    console.log('Unable to retrieve user info from server!');
  });
});
