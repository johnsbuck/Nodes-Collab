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
        $http.post('/login', $scope.formData).
        success(function(data) {
            console.log('Sent to sever successfully.');
            //window.location.replace('main.html', 'Signin.html');
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
    }
});

app.controller('settingsCtrl', function($scope, $http) {
  $scope.sub = function() {

  }
})
