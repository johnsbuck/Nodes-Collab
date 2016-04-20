var app = angular.module('nodesConnect', []);
//var groupPost = require('./groupGen',[]);

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

//Controller for the user profile
//TODO when viewing another user's profile, the "Add" button should add them to that user's profile.
app.controller('profileGen', function($scope, $http) {
  var viewingCurrentUser = true;    //Are we viewing the current user's profile or another person's profile? TODO integreate this better
    $scope.goToProfile = function(username) {
      console.log("Navigating to profile: " + username);
    }
    $scope.refreshConnections = function() {
      if(viewingCurrentUser == true) {
        console.log("Getting user contacts!");
        var formData = {username: sessionStorage.getItem('username'), pass : sessionStorage.getItem('pass')};
        $http.put('/user/get/connections', formData).
          success(function(data) {
            console.log("User Connections GET Request sent to server successfully!");
            //console.log(viewingCurrentUser);
            if(Object.keys(data).length != 0)
            {
              $scope.no_connections = Object.keys(data).length;
              //Initialize the select picker to the contacts
              //var selectOptions = "";   //none by default
              //Initialize table as string first
              var userTable =
                "<table class='table table-striped' width='100%'> " +
                  "<thead><tr><th>Username</th><th>View Profile</th></tr></thead>" +
                  "<tbody>";
                  data.forEach(function(value) {
                    var link = "";
                    //Problem: This JS gets called AFTER the rest of this method is done executing...So Link never gets put into the table...
                    /*
                    $.getScript("JS/connectionsLinkBuilder.js", function(){
                    param = '{ "user" : "' + value.second_user + '"}';
                    console.log(param);
                    link = singleLink(param);
                    console.log(link);
                    });
                    */
                    //Problem with this: goToProfile is never hit - so the link is not functional. Why?
                    //Removing the href="Profile.html" does not help."
                    link = '<button type="button" class="btn btn-default" type="submit" ng-model="profileGen" ng-click="goToProfile(' + value.second_user + ')">View Profile</button>'
                    //link = '<a href="Profile.html" ng-click="goToProfile(' + value.second_user + ')">View Profile</a>';
                    userTable += `<tr><td>` + value.second_user + `</td><td>` + link + `</td></tr>`;
                    //selectOptions += "<option>" + value.second_user + "</option>"
                  });
                  userTable += `</tbody></table>`;
                  //Finally set the table to the innerHTML
                  document.getElementById('viewConnectionsGen').innerHTML = userTable;
                  //document.getElementById('connectionsSelectOptions').innerHTML = selectOptions;
                  console.log(document.getElementById('viewConnectionsGen').innerHTML);
                }
                else {
                  $scope.no_connections = 0;
                  document.getElementById('viewConnectionsGen').innerHTML = "<p>No connections!</p>"
                  console.log("No connections for this user found.");
                }
              }).error(function(data) {
                console.log("User connections GET request not sent to server!");
              });
        }
    }
    $scope.viewContactsBtn_Click = function() {
      //Modal pops up from HTML
      console.log("View contacts button clicked!")
    }
    $scope.contactBtn_Click = function() {
      console.log("Mailto button clicked!");
      //TODO something better than opening in a new tab/window?
      window.open("mailto:" + sessionStorage.getItem('email'));
    }
    //Adds a connection. Requires username, password, newuser
    $scope.addConnection = function(formData) {
      //consider popping message in modal.
      console.log("Reached addConnection()");
      $scope.formData['username'] = sessionStorage.getItem('username');
      $scope.formData['pass'] = sessionStorage.getItem('pass');
      $http.put('/user/create/connection', formData).
        success(function(data) {
          $scope.no_connections += 1;   //Does this work???
          $scope.refreshConnections();         //refresh to update the modal as well.
          console.log("Connection added successfully!");
          popMessage("Connection Added!");
        }).error(function(data) {
          console.log("Error in connection create request!");
          popError("Error adding user!");
        });
    }
    $scope.sub = function() {
      $scope.formData = {};   //Init formData
      $scope.formData['username'] = sessionStorage.getItem('username');
      //TODO Make sure this plays nice with adding connections, etc.
      //TODO undo this at the end!
      if(sessionStorage.getItem('viewuser') != null && sessionStorage.getItem('viewuser') != "") {
        viewingCurrentUser = false;
        $scope.formData['username'] = sessionStorage.getItem('viewuser');       //If we are attempting to view a user other than ourselves, redefine 'username'.
      }
      $scope.formData['pass'] = sessionStorage.getItem('pass');   //Note pass isn't needed for /user/get
      //API call to get user information
      $http.put('/user/get', $scope.formData).
        success(function(data) {
            console.log('User GET Request sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
              //Clean possible null values from returned data.
              if(data.bio == null) data.bio = "You don't have a Bio :(";
              if(data.linkedin != null) { $scope.linkedin = data.linkedin; $scope.isLinkedInVisible = true; }
              if(data.facebook != null) { $scope.facebook = data.facebook; $scope.isFacebookVisible = true; }
              if(data.linkedin == null && data.facebook == null) {
                $scope.noSocialMediaWarning = "No Social Media links available for this user!";
                $scope.isNoSocialMediaWarningVisible = true;
              }
              $scope.username = data.username;  console.log("Username: " + $scope.username);
              $scope.bio = data.bio;            console.log("User bio: " + $scope.bio);
              sessionStorage.setItem('email', data.email);
            }
            else {
              $scope.txt = "Error no user found!";
            }
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
      //We also need to get the user's public groups they are part of.
      //API call requires: username and password.
      //TODO New API call to get all public groups ANY user is part of - no authentication required.
      //When viewingCurrentUser == false this will get a 403!
      $http.put('/group/get/groups', $scope.formData).
        success(function(data) {
            console.log('Groups GET Request sent to sever successfully.');
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                data.forEach(function(value) {
                  //TODO These should be links, but to what?
                  if(value.privacy == 0) document.getElementById("currentProjectsGen").innerHTML += value.groupname + " ";
                });
            }
            else {
              console.log("This user is not part of any groups!");
            }
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
      var formData = {username: sessionStorage.getItem('username'), pass : sessionStorage.getItem('pass')};
      $scope.refreshConnections();   //get the user connections
      sessionStorage.setItem('viewuser', "");
    }

    //Call method to execute code above.
    $scope.sub();
});

app.controller('groupPostCtrl', function($scope, $http) {
    $scope.txt = "";

    if(sessionStorage.getItem('currentgroup') == "null")
      $scope.group = "None; Join or create one!";
  else
    $scope.group = sessionStorage.getItem('currentgroup');

    $scope.count = 0;
    $scope.formData = {'username': sessionStorage.getItem('username'),
                        'groupname': sessionStorage.getItem('currentgroup'),
                        'pass': sessionStorage.getItem('pass')};
    $scope.init = function() {
      $http.put('/group-post/get', $scope.formData)
        .success(function(data) {
          console.log('Sent to sever successfully.');
          if(Object.keys(data).length != 0)
          {
              data.forEach(function(value) {
                $scope.count++;
                $.getScript("JS/groupGen.js", function(){
                  param = '{ "post" : [' +
                  '{ "username": "' + value.username + '", "text":"' + value.text + '", "timestamp":"' + value.timestamp + '" }]}';
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
      $scope.formData.groupname = sessionStorage.getItem('currentgroup');
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
    console.log($scope.formData);
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
          if($scope.formData.collabedit == true)//true -- open a collab edit
          {
            window.open("http://collabedit.com/new");//*NOTE pop-ups must be enabled for this to work
          }
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
          sessionStorage.setItem('currentgroup', data.currentgroup);
          sessionStorage.setItem('linkedin', data.linkedin);
          sessionStorage.setItem('facebook', data.facebook);
          sessionStorage.setItem('bio', data.bio);
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
  if(sessionStorage.getItem('bio') == "null")
    $scope.bio = "No current bio.";
  else
    $scope.bio = sessionStorage.getItem('bio');
  $scope.message = "Username: " + sessionStorage.getItem('username');
  $scope.messageName = "Name: " + sessionStorage.getItem('first_name') + " " + sessionStorage.getItem('last_name');
  $scope.messageEmail = "Email: " + sessionStorage.getItem('email');

  if(sessionStorage.getItem('facebook') == "null")
    $scope.facebook = "No Facebook linked.";
  else
  {
    $scope.facebook = sessionStorage.getItem('facebook');
    document.getElementById("fblink").innerHTML = $scope.facebook.link(sessionStorage.getItem('facebook'));
  }

  if(sessionStorage.getItem('linkedin') == "null")
    $scope.linkedin = "No LinkedIn linked.";
  else
  {
    $scope.linkedin = sessionStorage.getItem('linkedin');
    document.getElementById("lilink").innerHTML = $scope.linkedin.link(sessionStorage.getItem('linkedin'));
  }
  $scope.formData = {};
  $scope.formData.new = {};

  $scope.changeName = function() {
      console.log("Change Name");
      $scope.formData.username = sessionStorage.getItem('username');
      $scope.formData.pass = sessionStorage.getItem('pass');
      $http.put('/user/edit', $scope.formData).success(function(data) {
        console.log('Sent to the server successfully.');

        $http.put('/user/get', $scope.formData).success(function(data) {
          console.log(data);
          if(typeof $scope.formData.new.first_name !== 'undefined'){
            sessionStorage.setItem('first_name', $scope.formData.new.first_name);
          }

          if(typeof $scope.formData.new.last_name !== 'undefined'){
            sessionStorage.setItem('last_name', $scope.formData.new.last_name);
          }
            $scope.messageName = "Name: " + sessionStorage.getItem('first_name') + " " + sessionStorage.getItem('last_name');
        }).error(function(data) {
          console.log('ERROR');
        });
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
  }

  $scope.updateBio = function(){
    console.log("Update Bio");
     $scope.formData.username = sessionStorage.getItem('username');
     $scope.formData.pass = sessionStorage.getItem('pass');

     $http.put('/user/edit', $scope.formData).success(function(data) {
      console.log(data);
      if(typeof $scope.formData.new.bio !== 'undefined'){
        sessionStorage.setItem('bio', $scope.formData.new.bio);
      }
        $scope.bio = sessionStorage.getItem('bio');
        document.getElementById('bioSetting').value=$scope.bio;
     }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
  }

$scope.changeMedia = function() {
      console.log("Change Links");
      $scope.formData.username = sessionStorage.getItem('username');
      $scope.formData.pass = sessionStorage.getItem('pass');
      $http.put('/user/edit', $scope.formData).success(function(data) {
        console.log('Sent to the server successfully.');

        $http.put('/user/get', $scope.formData).success(function(data) {
          console.log(data);
          if(typeof $scope.formData.new.facebook !== 'undefined'){
            sessionStorage.setItem('facebook', $scope.formData.new.facebook);
             $scope.facebook = sessionStorage.getItem('facebook');
            document.getElementById("fblink").innerHTML = $scope.facebook.link(sessionStorage.getItem('facebook'));
          }

          if(typeof $scope.formData.new.linkedin !== 'undefined'){
            sessionStorage.setItem('linkedin', $scope.formData.new.linkedin);
            $scope.linkedin = sessionStorage.getItem('linkedin');
            document.getElementById("lilink").innerHTML = $scope.linkedin.link(sessionStorage.getItem('linkedin'));
          }
        }).error(function(data) {
          console.log('ERROR');
        });
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
  }


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
   if(sessionStorage.getItem('currentgroup') == "null")
      $scope.groupname = "(No Group)";
  else
      $scope.groupname = sessionStorage.getItem('currentgroup');

  $scope.formData = {'username': sessionStorage.getItem('username'),
                      'pass': sessionStorage.getItem('pass')};

    $scope.createGroup = function() {
      $scope.formData.groupname = $scope.formData.groupnameNew;
      $http.put('/group/create', $scope.formData).
      success(function(data) {
        $scope.formData.new = { 'currentgroup' : $scope.formData.groupname};
        $scope.switchGroup($scope.formData.new.groupname);
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
        $http.put('/group/get/groups', $scope.formData).
        success(function(data) {
          console.log("delete group data");
          console.log(data);
          if(data.length != 0) {
          $scope.formData.new = { 'currentgroup' : data[0].groupname};
          $scope.switchGroup(data[0].groupname);
          }
            document.getElementById('groupDeleteForm').value="";
            console.log('Sent to the server successfully.');
        }).error(function(data) {
          console.log('ERROR: Not sent to server.');
        });
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Used to display the groups the user is a part of.
    $scope.showGroups = function() {
      document.getElementById("Groups").innerHTML = "";
      $http.put('/group/get/groups', $scope.formData).
      success(function(data) {
        console.log('Sent to the server successfully.');
        if(Object.keys(data).length != 0)
        {
            data.forEach(function(dataElement)  {
              console.log(dataElement);
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
        document.getElementById("Members").innerHTML = "";
        console.log($scope.groupname);
      $scope.formData.groupname = $scope.groupname;
      $http.put('/group/get/members', $scope.formData).
      success(function(data) {
        console.log('Sent to the server successfully.');
        if(Object.keys(data).length != 0)
        {
            data.forEach(function(dataElement)  {
              console.log(dataElement);
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
      console.log($scope.formData);
      $http.put('/group/add/user', $scope.formData).
      success(function(data) {
        document.getElementById('userAdd').value="";
        $scope.showMembers();
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    $scope.removeMember = function() {
      console.log("Remove Members");
      console.log($scope.formData);
      $http.put('/group/delete/user', $scope.formData).
      success(function(data) {
        document.getElementById('userRemove').value="";
        $scope.showMembers();
        console.log('Sent to the server successfully.');
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

  /*  $scope.switchGroup = function() {
      sessionStorage.groupname = $scope.formData.groupnameSwitch;
      document.getElementById('groupSwitchForm').value="";
    }*/

    $scope.editGroup = function() {
      console.log("Edit group");
      console.log($scope.formData);
      $http.put('/user/edit', $scope.formData).success(function(data) {
       console.log("Update succeeded");
       console.log(data);
       if(typeof $scope.formData.new.currentgroup !== 'undefined'){
         sessionStorage.setItem('currentgroup', $scope.formData.new.currentgroup);
       }
         $scope.groupname = sessionStorage.getItem('currentgroup');
         $scope.showGroups($scope.formData);
         $scope.showMembers($scope.formData);
         console.log('Sent to the server successfully.');
      }).error(function(data) {
         console.log('ERROR: Not sent to server.');
       });
    }

    $scope.switchGroup= function(){
      $http.put('/group/get/groups', $scope.formData).
      success(function(data) {
        console.log("groups found");
        console.log(data);
        if(Object.keys(data).length != 0)
        {
            data.forEach(function(dataElement)  {
              if(dataElement.groupname == $scope.formData.new.currentgroup) {
                console.log("Found this group");
                console.log(dataElement);
                $scope.editGroup($scope.formData.new.currentgroup);
              }
            });
          }
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }
  });

  app.controller('searchWebsiteCtrl', function($scope, $http) {
      $scope.txt = "";
      $scope.sub = function(formData) {
        console.log(formData);
        console.log("infunction");
        var searchMethod = '';
        if (formData.searchType == 0 || formData.type == 1)//posts search
        {
          searchMethod = 'forumSearch';
        }
        else if (formData.searchType == 2) //group search
        {
          searchMethod = 'groupSearch';
        }
        else//user search
        {
          searchMethod = 'userSearch';
        }
        var searchCall = '/search/'+searchMethod;
        console.log(searchCall);
        $http.put(searchCall, formData).
          success(function(data) {
              console.log('Sent to sever successfully.' + data);
              document.getElementById("searchResults").innerHTML = "";
              //Apparently we need a directive to parse this data into a string -> use value.table_name
              if(Object.keys(data).length != 0)
              {
                var map = {};
                var prevKey = '';
                switch (searchMethod)
                {
                  case 'forumSearch':
                    //$scope.txt = "Some data has been found, let's print it out!";
                    angular.forEach(data, function(value, key) {
                      console.log("Key: " + key + ", Value: " + value.username + ", " + value.title + ", " + value.text);
                      //console.log(value.toJson); Shouldn't this work? Instead we will create our own JSON
                      if(!value.title.equals(prevKey))
                      {
                        map[value.title] = value;
                        map[value.title].count = 1;
                        prevKey = value.title;

                      }
                      else {
                        map[value.title].count++;
                      }

                    });
                    Object.keys(map).forEach(function(key, value){

                      var highestCount = -1;
                      var mostReleventkey = "";
                      Object.keys(map).forEach(function(key, value){
                        if(value.count > highestCount)
                        {
                          highestCount = value.count;
                          mostReleventkey = key;
                        }
                      });
                      map[mostReleventkey].count = -1;
                      var postData = map[mostReleventkey];
                      $.getScript("JS/tableGen.js", function(){
                        param = '{ "post" : [' +
                        '{ "username": "' + postData.username + '", "timestamp":"' + postData.timestamp + '", "post_title":"' + postData.title + '", "post_tags":"' + "notag" +
                        '", "type":"' + postData.type + '", "id":"' + postData.id + '" }]}';
                        console.log(param);
                        document.getElementById("searchResults").innerHTML += singlePost(param);
                      });
                    });
                    break;
                  case 'groupSearch':
                    var gname = "";
                    var privacy = "";
                    angular.forEach(data, function(value, key) {
                      console.log("key: " + key + " value: " + value);
                    //   console.log("Key: " + key + ", Value: " + value.groupname +" privacy "+ value.privacy);
                    //   //console.log(value.toJson); Shouldn't this work? Instead we will create our own JSON
                    //   if(value.privacy == 0)
                    //   {
                    //     if(!value.groupname.equals(prevKey))
                    //     {
                    //       map[value.groupname] = value;
                    //       map[value.groupname].count = 1;
                    //       prevKey = value.groupname;
                    //
                    //     }
                    //     else {
                    //       map[value.groupname].count++;
                    //     }
                    //   }
                    //
                    // });
                    // Object.keys(map).forEach(function(key, value){
                    //
                    //   var highestCount = -1;
                    //   var mostReleventkey = "";
                    //   Object.keys(map).forEach(function(key, value){
                    //     if(value.count > highestCount)
                    //     {
                    //       highestCount = value.count;
                    //       mostReleventkey = key;
                    //     }
                    //   });
                    //   map[mostReleventkey].count = -1;
                    //   var postData = map[mostReleventkey];
                    //   var groupPriv = "public";
                    //   if(postData.privacy == 1)
                    //   {
                    //     groupPriv = "private";
                    //   }

                      if(key === "privacy")
                      {
                        if(value == 0)
                        {
                          privacy = "public";
                        }
                        else {
                          privacy = "private";
                        }
                        $.getScript("JS/groupSearchResultBuilder.js", function(){
                          param = '{ "group" : [' +
                          '{ "groupname": "' + gname + '", "privacy":"' + privacy + '" }]}';
                          console.log(param);
                          document.getElementById("searchResults").innerHTML += singlePost(param);
                        });
                      }
                      else {
                        gname = value;
                        console.log(gname);
                      }
                    });
                    break;
                  case 'userSearch':
                    var usrname = "";
                    angular.forEach(data, function(value, key) {
                      console.log("key: " + key + " value: " + value);
                      if(key === "email")
                      {
                        $.getScript("JS/profileSearchResultBuilder.js", function(){
                        param = '{ "user" : [' +
                        '{ "username": "' + usrname + '", "email":"' + value + '" }]}';
                        console.log(param);
                        document.getElementById("searchResults").innerHTML += singlePost(param);
                        });
                      }
                      else {
                        usrname = value;
                      }
                    });
                    break;
                  default:
                    //we should never get here
                    break;
                }
              }
              else {
                $scope.txt = "No posts have been found. Try wording your search differently";
              }
          }).error(function(data){
              $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
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
