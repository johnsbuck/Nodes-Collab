var app = angular.module('nodesConnect', []);

app.controller('tableGen', function($scope, $http) {
    $scope.txt = "Test text";

    $scope.sub = function() {
    $http.put('/posts/get')
      .then(function(response) {
          alert(response.data);
      });
    }

    $scope.childOnLoad = function() {
        alert("Loaded!");
    };

    $scope.childOnLoad();
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
<<<<<<< HEAD
      }
    };
  }
=======
    }
  };
}
>>>>>>> Syntactical Errors Resolved - controller.js, qa_posts.js
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
