var app = angular.module('nodesConnect', []);

app.controller('newUserCtrl', function($scope, $http) {
    $scope.sub = function() {
        console.log($scope.formData);
        $http.post('/register', $scope.formData).
        success(function(data) {
            console.log('Sent to sever successfully.');
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
    }
});

app.controller('loginCtrl', function($scope, $http) {
    $scope.sub = function() {
        console.log($scope.formData);
        $http.get('/login', $scope.formData).
        success(function(data) {
            console.log('Sent to sever successfully.');
        }).error(function(data){
            console.log('ERROR: Not sent to server.');
        });
    }
});
