var app = angular.module('nodesConnect', []);

//Seperate this controller per post generating pages i.e. Q&A, Freelance
//AngularJS to retrieve the data from the DB
app.controller('userPostsGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      $scope.formData = {'username': sessionStorage.getItem('username')};

      $http.put('/user/get/posts', $scope.formData).
        success(function(data) {
          console.log(data);
            console.log('Sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //we want to build this reverse order to retrieve the most recent posts first
                //for each post returned
                data.reverse();
                angular.forEach(data, function(value, key) {

                  console.log("Retrieving tag data for: " + value.title + ", " + value.type);
                  $scope.formData = {'title': value.title,
                                    'type' : value.type};

                  var tagBuilder = "notag";
                  //get the tags for this posts
                  $http.put('/tag/get', $scope.formData).
                    success(function(dataTag) {
                        console.log('Sent to sever successfully.');
                        if(Object.keys(dataTag).length != 0)
                        {
                            console.log(dataTag);
                            //for each tag returned
                            tagBuilder = "";
                            angular.forEach(dataTag, function(valueTag, keyTag) {
                                tagBuilder += valueTag.tag + ";";
                              });
                              console.log("TagBuilder: " + tagBuilder);
                        }
                        else {
                            console.log("TagBuilder: Didn't find any tags for this post.");
                        }

                        $.getScript("JS/tableGen.js", function(){
                          param = '{ "post" : [' +
                          '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + tagBuilder +
                          '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
                          console.log(param);
                          document.getElementById("allPostsGen").innerHTML += singlePost(param);

                    }).error(function(dataTag){
                        //db error
                        console.log('ERROR: Tag data not sent to server.');
                    });
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

//Only shows QA posts
//AngularJS to retrieve the data from the DB
app.controller('QAPostGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> qa_posts put (which is redefined as a get).
      $http.put('/qa-post/get').
        success(function(data) {
            console.log('Sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //we want to build this reverse order to retrieve the most recent posts first
                //for each post returned
                data.reverse();
                angular.forEach(data, function(value, key) {

                  console.log("Retrieving tag data for: " + value.title + ", " + value.type);
                  $scope.formData = {'title': value.title,
                                    'type' : value.type};

                  var tagBuilder = "notag";
                  //get the tags for this posts
                  $http.put('/tag/get', $scope.formData).
                    success(function(dataTag) {
                        console.log('Sent to sever successfully.');
                        if(Object.keys(dataTag).length != 0)
                        {
                            console.log(dataTag);
                            //for each tag returned
                            tagBuilder = "";
                            angular.forEach(dataTag, function(valueTag, keyTag) {
                                tagBuilder += valueTag.tag + ";";
                              });
                              console.log("TagBuilder: " + tagBuilder);
                        }
                        else {
                            console.log("TagBuilder: Didn't find any tags for this post.");
                        }

                        $.getScript("JS/tableGen.js", function(){
                          param = '{ "post" : [' +
                          '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + tagBuilder +
                          '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
                          console.log(param);
                          document.getElementById("QAPostGen").innerHTML += singlePost(param);

                    }).error(function(dataTag){
                        //db error
                        console.log('ERROR: Tag data not sent to server.');
                    });
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

//Only shows Freelance posts
//AngularJS to retrieve the data from the DB
app.controller('freelancePostGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> qa_posts put (which is redefined as a get).
      $http.put('/free-post/get').
        success(function(data) {
            console.log('Sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name

            if(Object.keys(data).length != 0)
            {
                data.reverse();
                //$scope.txt = "Some data has been found, let's print it out!";
                angular.forEach(data, function(value, key) {

                  console.log("Retrieving tag data for: " + value.title + ", " + value.type);
                  $scope.formData = {'title': value.title,
                                    'type' : value.type};

                  var tagBuilder = "notag";
                  //get the tags for this posts
                  $http.put('/tag/get', $scope.formData).
                    success(function(dataTag) {
                        console.log('Sent to sever successfully.');
                        if(Object.keys(dataTag).length != 0)
                        {
                            console.log(dataTag);
                            //for each tag returned
                            tagBuilder = "";
                            angular.forEach(dataTag, function(valueTag, keyTag) {
                                tagBuilder += valueTag.tag + ";";
                              });
                              console.log("TagBuilder: " + tagBuilder);
                        }
                        else {
                            console.log("TagBuilder: Didn't find any tags for this post.");
                        }

                        $.getScript("JS/tableGen.js", function(){
                          param = '{ "post" : [' +
                          '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + tagBuilder +
                          '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
                          console.log(param);
                          document.getElementById("freelancePostGen").innerHTML += singlePost(param);

                    }).error(function(dataTag){
                        //db error
                        console.log('ERROR: Tag data not sent to server.');
                    });
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

//view a post based on the given postID (Stored in session)
app.controller('viewPostCtrl', function($scope, $http) {
    $scope.txt = "";
    $scope.init = function() {
      $scope.formData = { 'title': sessionStorage.getItem('postTitle')};//change this to be passed by jquery
      var accessor = '/qa-post';
      if(sessionStorage.getItem('postType')==1)
      {
          accessor = '/free-post';
      }
      //First get the post
      $http.put(accessor + '/get/post', $scope.formData)
        .success(function(data) {
          console.log(data);
          console.log('Sent to sever successfully.');
          //There should only be one object here
          if(Object.keys(data).length != 0)
          {
            console.log("Retrieving tag data for: " + sessionStorage.getItem('postTitle') + ", " + sessionStorage.getItem('postType'));
            $scope.formData = {'title': sessionStorage.getItem('postTitle'),
                              'type' : sessionStorage.getItem('postType')};

            var tagBuilder = "notag";
            //get the tags for this posts
            $http.put('/tag/get', $scope.formData).
              success(function(dataTag) {
                  console.log('Sent to sever successfully.');
                  if(Object.keys(dataTag).length != 0)
                  {
                      console.log(dataTag);
                      //for each tag returned
                      tagBuilder = "";
                      angular.forEach(dataTag, function(valueTag, keyTag) {
                          tagBuilder += valueTag.tag + ";";
                        });
                        console.log("TagBuilder: " + tagBuilder);
                  }
                  else {
                      console.log("TagBuilder: Didn't find any tags for this post.");
                  }

                  $.getScript("JS/viewPost.js", function(){
                    param = '{ "post" : [' +
                    '{ "author": "' + data.username + '", "text":"' + data.text + '", "timestamp":"' + data.timestamp + '", "title":"' + data.title + '", "post_tags":"' + tagBuilder +
                    '", "type":"' + data.type + '", "id":"' + data.id + '" }]}';
                    console.log(param);
                    document.getElementById("viewPostCtrl").innerHTML += viewPost(param);
                  });

              }).error(function(dataTag){
                  //db error
                  console.log('ERROR: Tag data not sent to server.');
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

    //delete a post
    $scope.delete = function() {
      console.log("pass");
      $scope.formData = {'username': sessionStorage.getItem('username'),
                        'pass' : sessionStorage.getItem('pass'),
                        'title' : sessionStorage.getItem('postTitle')};
      //console.log($scope.formData);
      var accessor = '/qa-post';
      var href = 'QandA.html';
      if(sessionStorage.getItem('postType')==1)
      {
        accessor = '/free-post';
        href = 'FreelanceEx.html';
      }
      console.log($scope.formData);
      $http.put(accessor + '/delete', $scope.formData).
          success(function(data) {
              console.log('Sent to sever successfully.');
              window.location.href = href;
          }).error(function(data){
              console.log('ERROR: Not sent to server.');
          });
      }

      //update a post
      $scope.update = function() {
        $scope.formData['username'] = sessionStorage.getItem('username');
        $scope.formData['pass'] = sessionStorage.getItem('pass');
        $scope.formData['titlePrev'] = sessionStorage.getItem('postTitle');
        var accessor = '/qa-post';
        var href = 'QandA.html';
        if(sessionStorage.getItem('postType')==1)
        {
          accessor = '/free-post';
          href = 'FreelanceEx.html';
        }
        console.log($scope.formData);
        /*$http.put(accessor + '/edit', $scope.formData).
            success(function(data) {
                console.log('Sent to sever successfully.');
                window.location.href = href;
            }).error(function(data){
                console.log('ERROR: Not sent to server.');
            });*/
        }

    $scope.init();
});

//generate comments for a specified post ID
app.controller('postCommentCtrl', function($scope, $http) {
    $scope.txt = "";

    $scope.init = function() {
      $scope.formData = {'title': sessionStorage.getItem('postTitle'),
                        'type' : sessionStorage.getItem('postType')};

      console.log($scope.formData);

      $http.put('/comments/get', $scope.formData)
        .success(function(data) {
          console.log(data);
          console.log('Sent to sever successfully.');

          if(Object.keys(data).length != 0)
          {
                data.reverse();
                angular.forEach(data, function(value, key) {
                  if(value.text) {
                    param = '{ "comment" : [' +
                    '{ "author": "' + value.username + '", "text":"' + value.text + '", "timestamp":"' + value.timestamp + '", "id":"' + value.id + '" }]}';
                    console.log(param);
                    document.getElementById("postCommentCtrl").innerHTML += viewComment(param);
                  }
                });

          }
          else {
                $scope.txt = "No comments for this post have been made yet!";
          }
          }).error(function(data) {
                    $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
                    console.log('ERROR: Not sent to server.');
          });
    }

    //delete a comment
    $scope.delete = function() {
      $scope.formData = {'username': sessionStorage.getItem('username'),
                        'pass' : sessionStorage.getItem('pass'),
                        'id' : sessionStorage.getItem('commentID')};
      console.log($scope.formData);
      $http.put('comments/delete', $scope.formData).
          success(function(data) {
              console.log('Sent to sever successfully.');
              location.reload();
          }).error(function(data){
              console.log('ERROR: Not sent to server.');
          });
      }

    $scope.init();
});

//Submit a comment for a post
app.controller('submitCommentCtrl', function($scope, $http, $location) {
  $scope.sub = function() {
    $scope.formData['username'] = sessionStorage.getItem('username');
    $scope.formData['title'] = sessionStorage.getItem('postTitle');
    $scope.formData['type'] = sessionStorage.getItem('postType');
    var date = new Date();
    var timezone = date.getTimezoneOffset();//timezone difference convert to seconds
    var dateOffset = new Date(date.getTime() - (timezone*60*1000));
    $scope.formData['timestamp'] = dateOffset;
    console.log($scope.formData);
    $http.post('/comments/post', $scope.formData).
      success(function(data) {
        location.reload();//refresh this page
        console.log('Sent to sever successfully.');
      }).error(function(data){
          console.log('ERROR: Not sent to server.');
      });
  }
  });

  //Submit a post for Freelancing
  app.controller('freelancePostCtrl', function($scope, $http, $location) {
    $scope.sub = function() {
      if($scope.formData != undefined && $scope.formData.text != "" && $scope.formData.title != "")
      {
        $scope.formData['username'] = sessionStorage.getItem('username');
        $scope.formData['pass'] = sessionStorage.getItem('pass');
        $scope.formData['tags'] = sessionStorage.getItem('postTags').split(';');//tags are submitted as an object array
        var date = new Date();
        var timezone = date.getTimezoneOffset();//timezone difference convert to seconds
        var dateOffset = new Date(date.getTime() - (timezone*60*1000));
        $scope.formData['timestamp'] = dateOffset;
        console.log($scope.formData);
        $http.post('/free-post/post', $scope.formData).
          success(function(data) {
            window.location.href = '/FreelanceEx.html';
            console.log('Sent to sever successfully.');
          }).error(function(data){
              console.log('ERROR: Not sent to server.');
              popError('A post in Freelancing was already found with the given title. Please submit with a unique title or checkout that post!');
          });
      }
      else {
          popError('A post may only be submitted if it has a title and text.');
        }
      }
    });

//SUBMIT a post for Q&A
app.controller('qaPostCtrl', function($scope, $http, $location) {
  $scope.sub = function() {
    if($scope.formData != undefined && $scope.formData.text != "" && $scope.formData.title != "")
    {
      $scope.formData['username'] = sessionStorage.getItem('username');
      $scope.formData['pass'] = sessionStorage.getItem('pass');
      $scope.formData['tags'] = sessionStorage.getItem('postTags').split(';');//tgs are submitted as an object array
      var date = new Date();
      var timezone = date.getTimezoneOffset();//timezone difference convert to seconds
      var dateOffset = new Date(date.getTime() - (timezone*60*1000));
      $scope.formData['timestamp'] = dateOffset;
      console.log($scope.formData);
      $http.post('/qa-post/post', $scope.formData).
        success(function(data) {
          window.location.href = '/QandA.html';
          console.log('Sent to sever successfully.');
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
            popError('A post in Q&A was already found with the given title. Please submit with a unique title or checkout that post!');
        });
    }
    else {
      popError('A post may only be submitted if it has a title and text.');
    }
  }
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
