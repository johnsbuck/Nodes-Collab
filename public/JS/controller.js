var app = angular.module('nodesConnect', []);

//Seperate this controller per post generating pages i.e. Q&A, Freelance
//AngularJS to retrieve the data from the DB
app.controller('tableGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> qa_posts put (which is redefined as a get).
      $http.put('/posts/get').
        success(function(data) {
            console.log('Sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //$scope.txt = "Some data has been found, let's print it out!";
                angular.forEach(data, function(value, key) {

                  console.log("Key: " + key + ", Value: " + value.username + ", " + value.title + ", " + value.text);
                  //console.log(value.toJson); Shouldn't this work? Instead we will create our own JSON
                  $.getScript("JS/tableGen.js", function(){
                    param = '{ "post" : [' +
                    '{ "postAuthor": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + "No tags found." + '" }]}';
                    console.log(param);
                    document.getElementById("tableGen").innerHTML += singlePost(param);
                  });
                });
            }
            else {
              $scope.txt = "No posts have been found. Make a post to see some activity!";
            }
        }).error(function(data){
            $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
            console.log('ERROR: Not sent to server.');
        });
    }

    $scope.sub();
});

//Used to control generating a user's profile
//AngularJS to retrieve the data from the DB
//TEMPORARY: using a static value instead of sessionStorage to grab the user
app.controller('userProfile', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> users put (which is redefined as a get).

      var formData = new FormData();
      formData.append('username', 'middle59');// must this be sent?
      // /user/get needs to parse username data from req.body.username so we need to make some artificial web request

      $http.put('/user/get', request).
        success(function(data) {
            console.log('Sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //we should only have one object here
                angular.forEach(data, function(value, key) {

                  console.log("Key: " + key + ", Value: " + value.username);
                  //console.log(value.toJson); Shouldn't this work? Instead we will create our own JSON
                  $.getScript("JS/profileGen.js", function(){
                    param = '{ "profile" : [' +
                    '{ "username": "' + value.username + '" }]}';
                    console.log(param);
                    document.getElementById("userProfile").innerHTML += singleProfile(param);
                  });
                });
            }
            else {
              $scope.txt = "This user does not seem to be in our database..";
            }
        }).error(function(data){
            $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
            console.log('ERROR: Not sent to server.');
        });
    }

    $scope.sub();
});

app.controller('newUserCtrl', function($scope, $http) {

  $scope.sub = function() {
    console.log($http);
      console.log($scope.formData);
      $http.put('/user/create', $scope.formData).
      success(function(data) {
          console.log('Sent to sever successfully.');
      }).error(function(data){
          console.log('ERROR: Not sent to server.');
      });
    }
});

app.controller('loginCtrl', function($scope, $http, $location) {//no closing bracket?

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
  }
});

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

app.controller('groupPostCtrl', function($scope, $http) {
  console.log("GROUPPOSTCTRL");
  $scope.message = "This function works";
  $scope.sub = function() {
    console.log($scope.formData);
    if($scope.formData != undefined) {
    $scope.formData.username = 'name';
    $scope.formData.groupname = 'group'
    $scope.formData.timestamp = '4/21/2016'
    console.log($http);
    $http.put('/group/post', $scope.formData).
    success(function(data) {
      console.log('Sent to the server successfully.');
    }).error(function(data) {
      console.log('ERROR: Not sent to server.');
    });
    }
    else {
      console.log("Please input data");
    }
  }
});

app.controller('collabSettingsCtrl', function($scope, $http) {
    $scope.sub = function() {
      $http.put('', $scope.formData)
      success(function(data) {
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }
  });
