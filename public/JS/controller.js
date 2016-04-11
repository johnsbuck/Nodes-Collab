var app = angular.module('nodesConnect', []);
//var groupPost = require('./groupGen',[]);

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

app.controller('groupPostCtrl', function($scope, $http) {
    $scope.txt = "";
    $scope.group = sessionStorage.getItem('groupname');
    $scope.count = 0;
    $scope.formData = {'username': sessionStorage.getItem('username'),
                        'groupname': sessionStorage.getItem('groupname'),
                        'pass': sessionStorage.getItem('pass')};
    $scope.init = function() {
      $http.put('/group-post/get', $scope.formData)
        .success(function(data) {
          console.log('Sent to sever successfully.');
              data.forEach(function(value) {
                $scope.count++;
                $.getScript("JS/groupGen.js", function(){
                  param = '{ "post" : [' +
                  '{ "username": "' + value.username + '", "text":"' + value.text + '", "timestamp":"' + value.timestamp + '" }]}';
                  document.getElementById("groupGen").innerHTML += singlePost(param);
                });
              });
          if(Object.keys(data).length != 0)
          {
          }
          else {
            $scope.txt = "No posts have been found. Make a post to see some activity!";
          }
        }).error(function(data) {
          $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
          console.log('ERROR: Not sent to server.');
        });
    }

    $scope.update = function() {
      $http.put('/group-post/get', $scope.formData).
        success(function(data) {
            console.log('Sent to sever successfully.');
            if(Object.keys(data).length != 0)
            {
                var i = 0;
                var dataSliced = data.slice($scope.count, data.length);
                dataSliced.forEach(function(dataElement)  {
                  $.getScript("JS/groupGen.js", function(){
                    param = '{ "post" : [' +
                    '{ "username": "' + dataElement.username + '", "text":"' + dataElement.text + '", "timestamp":"' + dataElement.timestamp + '" }]}';
                    document.getElementById("groupGen").innerHTML += singlePost(param);
                  });
                  i++;
                });
                  $scope.count += i;
              }
            }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
    }

    $scope.post = function() {
      console.log($scope.formData);
      if($scope.formData != undefined) {
      $scope.formData.username = sessionStorage.getItem('username');
      $scope.formData.groupname = sessionStorage.getItem('groupname');
      $scope.formData.timestamp = '4/16/2016';
      $scope.formData.pass = sessionStorage.getItem('pass');
      $http.put('/group-post/post', $scope.formData).
      success(function(data) {
        $scope.txt = '';
        document.getElementById('groupPostForm').value="";
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        $scope.update();
        console.log('ERROR: Not sent to server.');
      });
      }
      else {
        console.log("Please input data");
      }
    }
    $scope.init();
    window.setInterval(function() {
      $scope.update();
    }, 5000)
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
          sessionStorage.setItem('first_name', data.first_name);
          sessionStorage.setItem('last_name', data.last_name);
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

app.controller('generalCtrl', function($scope, $http) {
  $scope.message = "Username: " + sessionStorage.getItem('username');
  $scope.messageName = "Name: " + sessionStorage.getItem('first_name') + " " + sessionStorage.getItem('last_name');
  $scope.messageEmail = "Email: " + sessionStorage.getItem('email');
});


app.controller('settingsCtrl', function($scope, $http) {
  console.log("SETTINGS");
  $scope.sub = function() {
    console.log($scope.formData);
    $http.put('' , $scope.formData)
    success(function(data) {
      console.log('Sent to the server successfully.');
    }).error(function(data) {
      console.log('ERROR: Not sent to server.');
    });
  }
});

app.controller('blockedCtrl', function($scope, $http) {
  console.log("BlockedSettings");
  $scope.sub = function() {
    console.log($scope.formData);
    $http.put('/settings/blocked' , $scope.formData)
    success(function(data) {
      console.log('Sent to the server successfully.');
    }).error(function(data) {
      console.log('ERROR: Not sent to server.');
    });
  }
});

app.controller('collabSettingsCtrl', function($scope, $http) {
  $scope.groupname = sessionStorage.getItem('groupname');
  $scope.formData = {'username': sessionStorage.getItem('username'),
                      'pass': sessionStorage.getItem('pass')};
    $scope.createGroup = function() {
      $scope.formData.groupname = $scope.formData.groupnameNew;
      $http.put('/group/create', $scope.formData).
      success(function(data) {
        sessionStorage.groupname = $scope.formData.groupname;
        document.getElementById('groupCreateForm').value="";
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    $scope.deleteGroup = function() {
      $scope.formData.groupname = $scope.formData.groupnameDelete;
      console.log($scope.formData);
      $http.put('/group/delete', $scope.formData).
      success(function(data) {
        if(sessionStorage.groupname == $scope.formData.groupname)
        sessionStorage.groupname = "";
        document.getElementById('groupDeleteForm').value="";
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Used to display the groups the user is a part of.
    $scope.showGroups = function() {
      $http.put('/group/get/groups', $scope.formData).
      success(function(data) {
        console.log('Sent to the server successfully.');
        if(Object.keys(data).length != 0)
        {
            data.forEach(function(dataElement)  {
              $.getScript("JS/collabSettings.js", function(){
                param = '{ "post" : [' +
                '{ "groupname": "' + dataElement.groupname + '" }]}';
                document.getElementById("Groups").innerHTML += addGroup(param);
              });
            });
          }
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Used to show the members of a particular group.
    $scope.showMembers = function() {
      $scope.formData.groupname = sessionStorage.getItem('groupname');
      $http.put('/group/get/members', $scope.formData).
      success(function(data) {
        console.log('Sent to the server successfully.');
        if(Object.keys(data).length != 0)
        {
            data.forEach(function(dataElement)  {
              $.getScript("JS/collabSettings.js", function(){
                param = '{ "post" : [' +
                '{ "username": "' + dataElement.username + '" }]}';
                document.getElementById("Members").innerHTML += addMember(param);
              });
            });
          }
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    $scope.addMember = function() {
      console.log("Add Members");
      $scope.formData.groupname = sessionStorage.getItem('groupname');
      $scope.formData.pass = sessionStorage.getItem('pass');
      console.log($scope.formData);
      $http.put('/group/add/user', $scope.formData).
      success(function(data) {
        document.getElementById('userAdd').value="";
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    $scope.removeMember = function() {
      console.log("Remove Members");
      $scope.formData.groupname = sessionStorage.getItem('groupname');
      $scope.formData.pass = sessionStorage.getItem('pass');
      console.log($scope.formData);
      $http.put('/group/delete/user', $scope.formData).
      success(function(data) {
        document.getElementById('userRemove').value="";
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    $scope.switchGroup = function() {
      sessionStorage.groupname = $scope.formData.groupnameSwitch;
      document.getElementById('groupSwitchForm').value="";
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
