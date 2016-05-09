/*  controller.js
    The primary controller of our system. Links the front-end angular with NodeJS.
    To reference this script, declare ng-app="nodesConnect" in the html tag and then
    declare ng-controller="X", where X is the controller definition found below, in a tag
    containing the necessary components.
*/

var app = angular.module('nodesConnect', []);
//var groupPost = require('./groupGen',[]);

/*  userPostsGen
    Uses: JS/tableGen.js
    Used By: main.html
    Used For: Displays a table of posts, both Freelance and Q&A which have been made by
    the user which is currently logged in. This data is retreived from sessionStorage.
    Makes an API call to users.js to retrieve this data and builds the JSON which is
    passed to tableGen.js to make the display.
    The returning information is then written to the controlling element.
*/
app.controller('userPostsGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      $scope.formData = {'username': sessionStorage.getItem('username')};

      $http.put('/user/get/posts', $scope.formData).
        success(function(data) {
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //we want to build this reverse order to retrieve the most recent posts first
                //for each post returned
                data.reverse();
                angular.forEach(data, function(value, key) {
                  $scope.formData = {'title': value.title,
                                    'type' : value.type};

                  var tagBuilder = "notag";
                  //get the tags for this posts
                  $http.put('/tag/get', $scope.formData).
                    success(function(dataTag) {
                        if(Object.keys(dataTag).length != 0)
                        {
                            //for each tag returned
                            tagBuilder = "";
                            angular.forEach(dataTag, function(valueTag, keyTag) {
                                tagBuilder += valueTag.tag + ";";
                              });
                        }
                        else {
                            //No tags were found for this post, use the default value.
                        }

                        $.getScript("JS/tableGen.js", function(){
                          param = '{ "post" : [' +
                          '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + tagBuilder +
                          '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
                          document.getElementById("allPostsGen").innerHTML += singlePost(param);

                    }).error(function(dataTag){
                        //db error
                    });
                  });
                });

            }
            else {
              $scope.txt = "No posts have been found. Make a post to see some activity!";
            }
        }).error(function(data){
            $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
        });
    }

    $scope.sub();
});


/*  QAPostGen
    Uses: JS/tableGen.js
    Used By: QandA.html
    Used For: Displays a table of ONLY Q&A posts.
    This will display all Q&A posts, not ones just made by the user.
    Makes an API call to qa_posts.js to retrieve this data and builds the JSON which is
    passed to tableGen.js to make the display.
    The returning information is then written to the controlling element.
*/
app.controller('QAPostGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> qa_posts put (which is redefined as a get).
      $http.put('/qa-post/get').
        success(function(data) {
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                //we want to build this reverse order to retrieve the most recent posts first
                //for each post returned
                data.reverse();
                angular.forEach(data, function(value, key) {

                  $scope.formData = {'title': value.title,
                                    'type' : value.type};

                  var tagBuilder = "notag";
                  //get the tags for this posts
                  $http.put('/tag/get', $scope.formData).
                    success(function(dataTag) {
                        if(Object.keys(dataTag).length != 0)
                        {
                            //for each tag returned
                            tagBuilder = "";
                            angular.forEach(dataTag, function(valueTag, keyTag) {
                                tagBuilder += valueTag.tag + ";";
                              });
                        }
                        else {
                            //No tags were found for this post, use the default value.
                        }

                        $.getScript("JS/tableGen.js", function(){
                          param = '{ "post" : [' +
                          '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + tagBuilder +
                          '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
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
//Takes care of getting data from the backend like connections, user's bio,
//public groups, etc.
app.controller('profileGen', function($scope, $http) {
    //Function to refresh the list of contacts for the currently viewed user.
    //Called when user adds/removes a connection in the view connections modal.
    //Will make a /user/get/connections API call.
    $scope.refreshConnections = function() {
      var formData;
        if(sessionStorage.getItem('viewuser') != null && sessionStorage.getItem('viewuser') != "") {
          formData = {username: sessionStorage.getItem('viewuser')};       //If we are attempting to view a user other than ourselves, redefine 'username'.
        } else{
          formData = {username: sessionStorage.getItem('username')};
        }
        //HTTP get connection API call
        $http.put('/user/get/connections', formData).
          success(function(data) {
            //Function on success
            if(Object.keys(data).length != 0)
            {
              $scope.no_connections = Object.keys(data).length;   //set the # connections in html
              //Initialize table as string first
              var userTable =
                "<table class='table table-striped' id='connectionTable' width='100%'> " +
                  "<thead><tr><th>Username</th><th>View Profile</th></tr></thead>" +
                  "<tbody>";
                  data.forEach(function(value) {
                    var link = "";    //build HTML code to display connections & buttons
                    link = '<button type="button" class="btn btn-default viewProfile" type="submit" ng-model="profileGen" onclick="viewProfile(\'' + value.second_user + '\');">View Profile</button>' +
                            '<button type="button" class="btn btn-default deleteProfile" type="submit" ng-model="profileGen" onclick="deleteProfile(\'' + value.second_user + '\');">Delete</button>';
                    userTable += `<tr><td>` + value.second_user + `</td><td>` + link + `</td></tr>`;
                  });
                  userTable += `</tbody></table>`;
                  //Finally set the table to the innerHTML
                  document.getElementById('viewConnectionsGen').innerHTML = userTable;
                }
                else {
                  $scope.no_connections = 0;
                  document.getElementById('viewConnectionsGen').innerHTML = "<p>No connections!</p>"
                }
              }).error(function(data) {
                //error, no connections found for user or server error.
              });

    }
    //Modal pop-up to view connections list.
    $scope.viewContactsBtn_Click = function() {
      //Modal pops up from HTML, nothing done here.
    }
    //Trigger mailto to the currently viewed user email address.
    $scope.contactBtn_Click = function() {
      window.open("mailto:" + sessionStorage.getItem('email'));
    }
    //Adds a connection. Requires username, password, newuser
    $scope.addConnection = function(formData) {
      $scope.formData['username'] = sessionStorage.getItem('username');
      $scope.formData['pass'] = sessionStorage.getItem('pass');
      //create connection API call
      $http.put('/user/create/connection', formData).
        success(function(data) {
          $scope.no_connections += 1;
          $scope.refreshConnections();         //refresh to update the modal as well.
          popMessage("Connection Added!");
        }).error(function(data) {
          popError("Error adding user!");   //pop an error if user to add was not found.
        });
    }
    //Initial function that starts everything off, called from the
    //bottom of this controller.
    $scope.sub = function() {
      $scope.formData = {};   //Init formData
      $scope.formData['username'] = sessionStorage.getItem('username');

      if(sessionStorage.getItem('viewuser') != null && sessionStorage.getItem('viewuser') != "") {
        $scope.formData['username'] = sessionStorage.getItem('viewuser');       //If we are attempting to view a user other than ourselves, redefine 'username'.
        $scope.isAddConnectionButtonVisible = false;
      }else {
        $scope.isAddConnectionButtonVisible = true;
      }
      $scope.formData['pass'] = sessionStorage.getItem('pass');   //Note pass isn't needed for /user/get
      //API call to get user information
      $http.put('/user/get', $scope.formData).
        success(function(data) {
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
              $scope.username = data.username;
              $scope.bio = data.bio;
              sessionStorage.setItem('email', data.email);
            }
            else {
              $scope.txt = "Error no user found!";
            }
        }).error(function(data){
            //Server error.
        });
      //We also need to get the user's public groups they are part of.
      //API call requires: username and password.
      $http.put('/group/get/groups', $scope.formData).
        success(function(data) {
            //Apparently we need a directive to parse this data into a string -> use value.table_name
            if(Object.keys(data).length != 0)
            {
                data.forEach(function(value) {
                  //TODO These should be links, but to what?
                  if(value.privacy == 0) document.getElementById("currentProjectsGen").innerHTML += value.groupname + " ";
                });
            }
            else {
              //user is not part of any groups.
            }
        }).error(function(data){
            //Server error.
        });
      var formData = {username: sessionStorage.getItem('username'), pass : sessionStorage.getItem('pass')};
      $scope.refreshConnections();   //get the user connections
      sessionStorage.setItem('viewuser', "");
    }

    //Call method to execute code above.
    $scope.sub();
});

/* Controller for the messaging system of the projectcollab page (groupposting page).
    Holds functionallity to initialize the page, update it actively on a window set interval,
    retrive the needed posts, and add new posts.
*/
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

    //Sends a call to the backend to get the group-posts and then calls a script to generate html and appends it.
    $scope.init = function() {
      $http.put('/group-post/get', $scope.formData)
        .success(function(data) {
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

    //Sends a call to the backend to retrieve posts that have been added since the intialize page and appends them.
    $scope.update = function() {
      $http.put('/group-post/get', $scope.formData).
        success(function(data) {
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

    //Sends a call to the backend to add a group-post to the database with the current timestamp.
    $scope.post = function() {
      if($scope.formData != undefined) {
      $scope.formData.username = sessionStorage.getItem('username');
      $scope.formData.groupname = sessionStorage.getItem('currentgroup');
      var dt = new Date();
      var utcDate = dt.toUTCString();
      $scope.formData.timestamp = utcDate;
      $scope.formData.pass = sessionStorage.getItem('pass');
      $http.put('/group-post/post', $scope.formData).
      success(function(data) {
        $scope.txt = '';
        document.getElementById('groupPostForm').value="";
      }).error(function(data) {
        $scope.update();
        console.log('ERROR: Not sent to server.');
      });
      }
      else {
        //No input data
      }
    }

    //Used to initalize page on load and update at the specified interval.
    $scope.init();
    window.setInterval(function() {
      $scope.update();
    }, 5000)
});

/*  freelancePostGen
    Uses: JS/tableGen.js
    Used By: FreelanceEx.html
    Used For: Displays a table of ONLY Freelance posts.
    This will display all Freelance posts, not ones just made by the user.
    Makes an API call to freelance_posts.js to retrieve this data and builds the JSON which is
    passed to tableGen.js to make the display.
    The returning information is then written to the controlling element.
*/
app.controller('freelancePostGen', function($scope, $http) {
    $scope.txt = "";

    $scope.sub = function() {
      //API CALL -> qa_posts put (which is redefined as a get).
      $http.put('/free-post/get').
        success(function(data) {
            //Apparently we need a directive to parse this data into a string -> use value.table_name

            if(Object.keys(data).length != 0)
            {
                data.reverse();
                //$scope.txt = "Some data has been found, let's print it out!";
                angular.forEach(data, function(value, key) {


                  $scope.formData = {'title': value.title,
                                    'type' : value.type};

                  var tagBuilder = "notag";
                  //get the tags for this posts
                  $http.put('/tag/get', $scope.formData).
                    success(function(dataTag) {
                        if(Object.keys(dataTag).length != 0)
                        {
                            //for each tag returned
                            tagBuilder = "";
                            angular.forEach(dataTag, function(valueTag, keyTag) {
                                tagBuilder += valueTag.tag + ";";
                              });
                        }
                        else {
                            //No tags found, use the default value.
                        }

                        $.getScript("JS/tableGen.js", function(){
                          param = '{ "post" : [' +
                          '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + tagBuilder +
                          '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
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

/*  viewPostCtrl
    Uses: JS/viewPost.js
    Used By: ViewQAPost.html, ViewFreelancePost.html
    Used For: Displays a single post based on the ID found in sessionStorage.
    Makes an API call to either qa_posts.js or freelance_posts.js to retrieve the data about the post and build a JSON for it.
    The data is then passed to viewPost.js to make the display.
    The returning information is then written to the controlling element.
*/
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
          //There should only be one object here
          if(Object.keys(data).length != 0)
          {
            $scope.formData = {'title': sessionStorage.getItem('postTitle'),
                              'type' : sessionStorage.getItem('postType')};

            var tagBuilder = "notag";
            //get the tags for this posts
            $http.put('/tag/get', $scope.formData).
              success(function(dataTag) {
                  if(Object.keys(dataTag).length != 0)
                  {
                      //for each tag returned
                      tagBuilder = "";
                      angular.forEach(dataTag, function(valueTag, keyTag) {
                          tagBuilder += valueTag.tag + ";";
                        });
                  }
                  else {
                      //No tags found, use the default value.
                  }

                  $.getScript("JS/viewPost.js", function(){
                    param = '{ "post" : [' +
                    '{ "author": "' + data.username + '", "text":"' + data.text + '", "timestamp":"' + data.timestamp + '", "title":"' + data.title + '", "post_tags":"' + tagBuilder +
                    '", "type":"' + data.type + '", "id":"' + data.id + '" }]}';
                    param = param.replace("\n", "\\n");
                    param = param.replace(/\s+/g," ");
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
      $scope.formData = {'username': sessionStorage.getItem('username'),
                        'pass' : sessionStorage.getItem('pass'),
                        'title' : sessionStorage.getItem('postTitle')};
      var accessor = '/qa-post';
      var href = 'QandA.html';
      if(sessionStorage.getItem('postType')==1)
      {
        accessor = '/free-post';
        href = 'FreelanceEx.html';
      }
      $http.put(accessor + '/delete', $scope.formData).
          success(function(data) {
              window.location.href = href;
          }).error(function(data){
              console.log('ERROR: Not sent to server.');
          });
      }

    $scope.init();
});

/*  postCommentCtrl
    Uses: JS/commentGen.js
    Used By: ViewQAPost.html, ViewFreelancePost.html
    Used For: Displays a list of comments for a single post based on the ID found in sessionStorage.
    Makes an API call to comments.js to retrieve all comment data about the post and build a JSON for it.
    The data is then passed to commentGen.js to make the display.
    The returning information is then written to the controlling element.
*/
app.controller('postCommentCtrl', function($scope, $http) {
    $scope.txt = "";

    $scope.init = function() {
      $scope.formData = {'title': sessionStorage.getItem('postTitle'),
                        'type' : sessionStorage.getItem('postType')};

      $http.put('/comments/get', $scope.formData)
        .success(function(data) {
          if(Object.keys(data).length != 0)
          {
                data.reverse();
                angular.forEach(data, function(value, key) {
                  if(value.text) {
                    param = '{ "comment" : [' +
                    '{ "author": "' + value.username + '", "text":"' + value.text + '", "timestamp":"' + value.timestamp + '", "id":"' + value.id + '" }]}';
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
      $http.put('comments/delete', $scope.formData).
          success(function(data) {
              location.reload();
          }).error(function(data){
              console.log('ERROR: Not sent to server.');
          });
      }

    $scope.init();
});

/*  submitCommentCtrl
    Uses: --
    Used By: ViewQAPost.html, ViewFreelancePost.html
    Used For: Retrieves data from the comment element to submit a comment to the Database on the current post.
    Makes an API call to comments.js to post the comment data.
    Once the comment is posted successfully, the page is reloaded.
*/
app.controller('submitCommentCtrl', function($scope, $http, $location) {
  $scope.sub = function() {
    $scope.formData['username'] = sessionStorage.getItem('username');
    $scope.formData['title'] = sessionStorage.getItem('postTitle');
    $scope.formData['type'] = sessionStorage.getItem('postType');
    var date = new Date();
    var timezone = date.getTimezoneOffset();//timezone difference convert to seconds
    var dateOffset = new Date(date.getTime() - (timezone*60*1000));
    $scope.formData['timestamp'] = dateOffset;
    $http.post('/comments/post', $scope.formData).
      success(function(data) {
        location.reload();//refresh this page
      }).error(function(data){
          console.log('ERROR: Not sent to server.');
      });
  }
  });

  //Submit a post for Freelancing

/*  freelancePostCtrl
    Uses: --
    Used By: FreelanceSubmitPost.html
    Used For: Retrieves data from the forum post element to submit a post to the Database.
    Makes an API call to freelance_posts.js to insert the post data.
    Once the post is submitted successfully, the client is redirected to /FreelanceEx.html.
*/
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
        $http.post('/free-post/post', $scope.formData).
          success(function(data) {
            window.location.href = '/FreelanceEx.html';
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

/*  freelancePostCtrl
    Uses: --
    Used By: QASubmitPost.html
    Used For: Retrieves data from the forum post element to submit a post to the Database.
    Makes an API call to qa_posts.js to insert the post data.
    Opens a collabedit page if the checkbox was selected.
    Once the post is submitted successfully, the client is redirected to /QandA.html.
*/
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
      $http.post('/qa-post/post', $scope.formData).
        success(function(data) {
          if($scope.formData.collabedit == true)//true -- open a collab edit
          {
            window.open("http://collabedit.com/new");//*NOTE pop-ups must be enabled for this to work
          }
          window.location.href = '/QandA.html';
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
      if($scope.formData && $scope.formData.first_name && $scope.formData.last_name &&
        $scope.formData.username && $scope.formData.email && $scope.formData.pass
        && $scope.formData.gender) {
        $http.put('/user/create', $scope.formData).
        success(function(data) {
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
    if($scope.formData && $scope.formData.email && $scope.formData.pass) {
      $http.put('/login', $scope.formData).
      success(function(data) {
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
        $http.post('/login', $scope.formData).
        success(function(data) {
          window.location.href = '/main.html';
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
      $scope.formData.username = sessionStorage.getItem('username');
      $scope.formData.pass = sessionStorage.getItem('pass');
      $http.put('/user/edit', $scope.formData).success(function(data) {

        $http.put('/user/get', $scope.formData).success(function(data) {
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
     $scope.formData.username = sessionStorage.getItem('username');
     $scope.formData.pass = sessionStorage.getItem('pass');

     $http.put('/user/edit', $scope.formData).success(function(data) {
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
      $scope.formData.username = sessionStorage.getItem('username');
      $scope.formData.pass = sessionStorage.getItem('pass');
      $http.put('/user/edit', $scope.formData).success(function(data) {

        $http.put('/user/get', $scope.formData).success(function(data) {
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
  $scope.sub = function() {
    $http.put('' , $scope.formData)
    success(function(data) {
    }).error(function(data) {
      console.log('ERROR: Not sent to server.');
    });
  }
});

app.controller('blockedCtrl', function($scope, $http) {
  $scope.sub = function() {
    $http.put('/settings/blocked' , $scope.formData)
    .error(function(data) {
      console.log('ERROR: Not sent to server.');
    });
  }
});

/* Controller for projectcollab settings page.
    Used to call methods that will create,delete, and switch groups.
    As well as add and remove members.
*/
app.controller('collabSettingsCtrl', function($scope, $http) {
   if(sessionStorage.getItem('currentgroup') == "null")
      $scope.groupname = "(No Group)";
  else
      $scope.groupname = sessionStorage.getItem('currentgroup');

  $scope.formData = {'username': sessionStorage.getItem('username'),
                      'pass': sessionStorage.getItem('pass')};

    //Sends a call to the backend to create a group.
    $scope.createGroup = function() {
      $scope.formData.groupname = $scope.formData.groupnameNew;
      $http.put('/group/create', $scope.formData).
      success(function(data) {
        $scope.formData.new = { 'currentgroup' : $scope.formData.groupname};
        $scope.switchGroup($scope.formData.new.groupname);
        document.getElementById('groupCreateForm').value="";
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Sends a call to the back end to delete a group.
    $scope.deleteGroup = function() {
      $scope.formData.groupname = $scope.formData.groupnameDelete;
      $http.put('/group/delete', $scope.formData).
      success(function(data) {
        $http.put('/group/get/groups', $scope.formData).
        success(function(data) {
          if(data.length != 0) {
          $scope.formData.new = { 'currentgroup' : data[0].groupname};
          $scope.switchGroup(data[0].groupname);
          }
            document.getElementById('groupDeleteForm').value="";
        }).error(function(data) {
          console.log('ERROR: Not sent to server.');
        });
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Used to display the groups the user is a part of.
    $scope.showGroups = function() {
      document.getElementById("Groups").innerHTML = "";
      $http.put('/group/get/groups', $scope.formData).
      success(function(data) {
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
        document.getElementById("Members").innerHTML = "";
      $scope.formData.groupname = $scope.groupname;
      $http.put('/group/get/members', $scope.formData).
      success(function(data) {
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

    //Used to add a member to the current group the user adding the member is in.
    $scope.addMember = function() {
      $http.put('/group/add/user', $scope.formData).
      success(function(data) {
        document.getElementById('userAdd').value="";
        $scope.showMembers();
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Used to remove a member from the current group the user is in. (This member can be the user themselves)
    $scope.removeMember = function() {
      $http.put('/group/delete/user', $scope.formData).
      success(function(data) {
        document.getElementById('userRemove').value="";
        $scope.showMembers();
      }).error(function(data) {
        console.log('ERROR: Not sent to server.');
      });
    }

    //Sends a call to the backend to edit information about the group.
    $scope.editGroup = function() {
      $http.put('/user/edit', $scope.formData).success(function(data) {
       if(typeof $scope.formData.new.currentgroup !== 'undefined'){
         sessionStorage.setItem('currentgroup', $scope.formData.new.currentgroup);
       }
         $scope.groupname = sessionStorage.getItem('currentgroup');
         $scope.showGroups($scope.formData);
         $scope.showMembers($scope.formData);

      }).error(function(data) {
         console.log('ERROR: Not sent to server.');
       });
    }

    //Sends a call to the backend to retreive the information on the group the user wishes to switch to.
    $scope.switchGroup= function(){
      $http.put('/group/get/groups', $scope.formData).
      success(function(data) {
        if(Object.keys(data).length != 0)
        {
            data.forEach(function(dataElement)  {
              if(dataElement.groupname == $scope.formData.new.currentgroup) {
                $scope.editGroup($scope.formData.new.currentgroup);
              }
            });
          }
      }).error(function(data) {
      });
    }
  });

  /*  searchWebsiteCtrl
      Uses: JS/profileSearchResultBuilder.js JS/groupSearchResultBuilder.js JS/tableGen.js Routes/search.js
      Used By: SearchEx.html
      Used To: Search the Website and Display Results
      This function will take a search string and a search method type and call the
      appropriate quering method in Routes with the search string and post type if the
      search is for a post.
      The returning information is then written to the controlling element in SearchEx.html.
  */
  app.controller('searchWebsiteCtrl', function($scope, $http) {
      $scope.txt = "";
      $scope.sub = function(formData) {
        //used in switch, determines search
        var searchMethod = '';
        if (formData.searchType == 0 || formData.searchType == 1)//posts search
        {
          searchMethod = 'forumSearch';
        }
        else if (formData.searchType == 2) //group search
        {
          searchMethod = 'groupSearch';
        }
        else if (formData.searchType == 4 || formData.searchType == 5)
        {
          searchMethod = 'forumSearchByTags';
        }
        else//user search
        {
          searchMethod = 'userSearch';
        }
        var searchCall = '/search/'+searchMethod;
        $http.put(searchCall, formData).
          success(function(data) {
              document.getElementById("searchResults").innerHTML = "";//reset html in controlling element
              if(Object.keys(data).length != 0)
              {
                switch (searchMethod)//Call the appropriate query and html results generator
                {
                  case 'forumSearch':
                    angular.forEach(data, function(value, key) {
                      $.getScript("JS/tableGen.js", function(){
                        param = '{ "post" : [' +
                        '{ "username": "' + value.username + '", "timestamp":"' + value.timestamp + '", "post_title":"' + value.title + '", "post_tags":"' + "notag" +
                        '", "type":"' + value.type + '", "id":"' + value.id + '" }]}';
                        document.getElementById("searchResults").innerHTML += singlePost(param);
                      });
                    });
                    break;
                  case 'forumSearchByTags':
                    angular.forEach(data, function(value, key) {
                      if(value.type == formData.searchType - 4)
                      {
                        formData.title = value.title;
                        $http.put("/search/getPostFromTag", formData).
                          success(function(row) {
                            var post = row[0];
                            $.getScript("JS/tableGen.js", function(){
                              param = '{ "post" : [' +
                              '{ "username": "' + post.username + '", "timestamp":"' + post.timestamp + '", "post_title":"' + post.title + '", "post_tags":"' + value.tag +
                              '", "type":"' + post.type + '", "id":"' + post.id + '" }]}';
                              document.getElementById("searchResults").innerHTML += singlePost(param);
                            });
                        }).error(function(data){
                            $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
                        });
                     }
                    });
                    break;
                  case 'groupSearch':
                    var privacy = "";
                    angular.forEach(data, function(value, key) {
                        if(value.privacy == 0)
                        {
                          privacy = "public";
                        }
                        else {
                          privacy = "private";
                        }
                        $.getScript("JS/groupSearchResultBuilder.js", function(){
                          param = '{ "group" : [' +
                          '{ "groupname": "' + value.groupname + '", "privacy":"' + privacy + '" }]}';
                          document.getElementById("searchResults").innerHTML += singleGroup(param);
                        });

                    });
                    break;
                  case 'userSearch':
                    angular.forEach(data, function(value, key) {
                      $.getScript("JS/profileSearchResultBuilder.js", function(){
                      param = '{ "user" : [' +
                      '{ "username": "' + value.username + '", "email":"' + value.email + '" }]}';
                      document.getElementById("searchResults").innerHTML += singleUser(param);
                      });
                    });
                    break;
                  default:
                    //we will never get here
                    break;
                }
              }
              else {
                $scope.txt = "No posts have been found. Try wording your search differently";
              }
          }).error(function(data){
              $scope.txt = "Oops! There was a database error. Are you sure you are connected or the query is correct?";
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
