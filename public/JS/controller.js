var app = angular.module('nodesConnect', []);

//Seperate this controller per post generating pages i.e. Q&A, Freelance
//AngularJS to retrieve the data from the DB
app.controller('tableGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> qa_posts put (which is redefined as a get).
      $http.put('/qa-post/get').
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

//Controller for the user profile
app.controller('profileGen', function($scope, $http) {
    //$scope.txt = "";
    //$scope.username = sessionStorage.getItem('username');
    //console.log("Username: " + sessionStorage.getItem('username'));
    //Adds a connection. Requires username, password, newuser
    $scope.addConnection = function(formData) {
      //consider popping message in modal.
      console.log("Reached addConnection()");
      $scope.formData['username'] = sessionStorage.getItem('username');
      $scope.formData['pass'] = sessionStorage.getItem('pass');
      $http.put('/user/create/connection', formData).
        success(function(data) {
          console.log("Connection added successfully!");
          popMessage("Connection Added!");
        }).error(function(data) {
          console.log("Error in connection create request!");
          popError("Error adding user!");
        });
    }
    $scope.sub = function() {
      $scope.formData = {};
      $scope.formData['username'] = sessionStorage.getItem('username');
      //If we are attempting to view a user other than ourselves, redefine 'username'.
      //TODO Make sure this plays nice with adding connections, etc.
      //TODO undo this at the end!
      if(sessionStorage.getItem('viewuser') != null) $scope.formData['username'] = sessionStorage.getItem('viewuser');
      $scope.formData['pass'] = sessionStorage.getItem('pass');
      //$http.put('/user/')
      //API call to get user information
      $http.put('/user/get', $scope.formData).
        success(function(data) {
            console.log('User GET Request sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
              //console.log("" + ((data.bio!= null) ? data.bio : "No bio!"));
              //Clean possible null values from returned data.
              if(data.bio == null) data.bio = "You don't have a Bio :(";

              $scope.username = data.username;  console.log("Username: " + $scope.username);
              $scope.bio = data.bio;            console.log("User bio: " + $scope.bio);
              //The JSON to pass to the profile generator
              //var json = JSON.stringify(data);
              //TEMP: Parse it back so I know what I am doing.
              //var obj = JSON.parse(json);   //parse the JSON into an object we can use to generate HTML
              //var string = obj.bio;         //temp, should give us a string.
              /*
              $.getScript("JS/profileGen.js", function(){
                    console.log(json);
                    var html = generateProfile(json);
                    document.getElementById("profileGen").innerHTML = generateProfile(json);
              });
              */
            }
            else {
              $scope.txt = "Error no user found!";
            }
        //This is reached although .success is reached before...
        }).error(function(data){
            //$scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
            console.log('ERROR: Not sent to server.');
        });
      var formData = {username: sessionStorage.getItem('username'), pass : sessionStorage.getItem('pass')};
      //TODO error 406? What am I not passing correctly in the request?
      $http.put('/user/get/connections', formData).
        success(function(data) {
          console.log("User Connections GET Request sent to server successfully!");
          if(Object.keys(data).length != 0)
          {
            //We have received connections from the DB here.
            console.log(data);
          }
          else {
            console.log("No connections for this user found.");
          }
        }).error(function(data) {
          console.log("User connections GET request not sent to server!");
        });
    }
    //Call method to execute code above.
    $scope.sub();
});

app.controller('groupPostGen', function($scope, $http) {
    $scope.txt = "";
    $scope.groupname = sessionStorage.getItem('groupname');
    $scope.username = sessionStorage.getItem('username');
    $scope.init = function() {
      $scope.formData = {'username': sessionStorage.getItem('username'),
                          'groupname': sessionStorage.getItem('groupname'),
                          'pass': sessionStorage.getItem('pass')};
      $http.put('/group-post/get', $scope.formData)
        .success(function(data) {
          console.log(data);
          console.log('Sent to sever successfully.');
          //Apparently we need a directive to parse this data into a string -> use value.table_name
          if(Object.keys(data).length != 0)
          {
              //$scope.txt = "Some data has been found, let's print it out!";
              angular.forEach(data, function(value, key) {

                console.log("Key: " + key + ", Value: " + value.username + ", " + value.text + ", " + value.timestamp);
                //console.log(value.toJson); Shouldn't this work? Instead we will create our own JSON
                $.getScript("JS/groupGen.js", function(){
                  param = '{ "post" : [' +
                  '{ "username": "' + value.username + '", "text":"' + value.text + '", "timestamp":"' + value.timestamp + '" }]}';
                  console.log(param);
                  document.getElementById("groupGen").innerHTML += singlePost(param);
                });
              });
          }
          else {
            $scope.txt = "No posts have been found. Make a post to see some activity!";
          }
        }).error(function(data) {
          $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
          console.log('ERROR: Not sent to server.');
        });
    }

    $scope.sub = function() {
      console.log($scope.groupname);
      console.log($scope.username);
      $http.put('/group-post/get', $scope.formData).
        success(function(data) {
            console.log('Sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //$scope.txt = "Some data has been found, let's print it out!";
                angular.forEach(data, function(value, key) {

                  console.log("Key: " + key + ", Value: " + value.username + ", " + value.text + ", " + value.timestamp);
                  //console.log(value.toJson); Shouldn't this work? Instead we will create our own JSON
                  $.getScript("JS/groupGen.js", function(){
                    param = '{ "post" : [' +
                    '{ "username": "' + value.username + '", "text":"' + value.text + '", "timestamp":"' + value.timestamp + '" }]}';
                    console.log(param);
                    document.getElementById("groupGen").innerHTML += singlePost(param);
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

    $scope.init();
});

app.controller('newUserCtrl', function($scope, $http) {

  $scope.sub = function() {
    console.log($http);
      console.log($scope.formData);
      if($scope.formData && $scope.formData.first_name && $scope.formData.last_name &&
        $scope.formData.username && $scope.formData.email && $scope.formData.pass
        && $scope.formData.gender) {
        $http.put('/user/create', $scope.formData).
        success(function(data) {
            console.log('Sent to sever successfully.');
            window.location.href = '/Signin.html';
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
            popError('Please use a not taken username and email.');
        });
      }
    }
});

app.controller('loginCtrl', function($scope, $http, $location) {

  $scope.sub = function() {
    console.log($scope.formData);
    console.log($http.defaults.headers.common);
    if($scope.formData && $scope.formData.email && $scope.formData.pass) {
      $http.put('/login', $scope.formData).
      success(function(data) {
        console.log($scope.formData);
        $http.put('/user/get', $scope.formData).success(function(data) {
          sessionStorage.setItem('username', data.username);
          sessionStorage.setItem('email', $scope.formData.email);
          sessionStorage.setItem('pass', $scope.formData.pass);

          window.location.href = '/main.html';
          console.log('Sent to sever successfully.');
        }).error(function(data) {
          console.log('Unable to receive user info.');
          popError('Unable to receive user info');
        });
      }).error(function(data){
          console.log('ERROR: Not sent to server.');
          popError('Username or password is not correct');
      });
    }
  }

  $scope.init = function() {
    if(sessionStorage.getItem('username') && sessionStorage.getItem('email') &&
      sessionStorage.getItem('password')) {
      $scope.formData = {
        email: sessionStorage.getItem('email'),
        pass: sessionStorage.getItem('password')
      };

      $scope.sub($scope.formData);
    $scope.sub = function() {
        console.log($scope.formData);
        $http.post('/login', $scope.formData).
        success(function(data) {
          window.location.href = '/main.html';
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

app.controller('navCtrl', function($scope, $http) {
  $scope.signout = function() {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
});

app.controller('mainCtrl', function($scope, $http) {
  if(!sessionStorage.username && !sessionStorage.pass) {
    window.location.href = '/index.html';
  }
  $scope.message = "Welcome back, " + sessionStorage.getItem('username');
});

app.controller('groupPostCtrl', function($scope, $http) {
  console.log("GROUPPOSTCTRL");
  $scope.message = "This function works";
  $scope.sub = function() {
    console.log($scope.formData);
    if($scope.formData != undefined) {
    $scope.formData.username = sessionStorage.getItem('username');
    $scope.formData.groupname = sessionStorage.getItem('groupname');
    $scope.formData.timestamp = '4/21/2016'
    $scope.formData.pass = sessionStorage.getItem('pass');
    console.log($http);
    $http.put('/group-post/post', $scope.formData).
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
    console.log("CollabSettings");
    $scope.sub = function() {
      console.log($scope.formData);
      $scope.formData.username = sessionStorage.getItem('username');
      $http.put('/group/create', $scope.formData).
      success(function(data) {
        sessionStorage.groupname = $scope.formData.groupname;
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }
  });

function popError(msg) {
  if(!$('.popup-error').length) {
    $('.container').prepend('<br><div class="popup-error alert alert-danger">' +
      '<div class="panel-heading panel-title message" style="text-align: center">' +
      msg + '</div></div>');
      $('.popup-error').fadeOut(5000);
  } else {
    $('.popup-error').stop();
    $('.message').text(msg);
    $('.popup-error').fadeIn(200, function() {
      $('.popup-error').fadeOut(5000);
    });
  }
}

function popMessage(msg) {
  if(!$('.popup').length) {
    $('.container').prepend('<br><div class="popup alert alert-success">' +
      '<div class="panel-heading panel-title message" style="text-align: center">' +
      msg + '</div></div>');
      $('.popup').fadeOut(5000);
  } else {
    $('.popup').stop();
    $('.message').text(msg);
    $('.popup').fadeIn(200, function() {
      $('.popup').fadeOut(5000);
    });
  }
}
