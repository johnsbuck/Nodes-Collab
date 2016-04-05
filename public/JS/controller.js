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
          sessionStorage.setItem('password', $scope.formData.pass);

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
