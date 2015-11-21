'use strict';
var myApp = angular.module('app', [
	'ui.bootstrap',
  'ngResource',
	'lbServices'
]);

myApp.controller('AdminController', function($scope, $http, $window, Novedad) {  
  function getNovedades() {
    Novedad.find(function(data) {
      angular.forEach(data, function(value, key) {
        console.log(value, key);
        value.fecha = moment(value.fecha).format('YYYY-MM-DD');
      });
      console.log(data);
      $scope.novedades = data;
    });
  }
  
  getNovedades();
  
  $scope.novedad = {
    fecha: moment().format('YYYY-MM-DD'),
    descripcion: ''
  };
  
  $scope.agregarNovedad = function() {
    Novedad.create({
      fecha: $scope.novedad.fecha,
      descripcion: $scope.novedad.descripcion
    }, function(data) {
      getNovedades();
      console.log(data);
      
    }, function(err) {
      console.log(err);
    });
  };
  
  $scope.toDelete = [];
  
  $scope.addToRemove = function(id) {
    function include(arr,obj) {
      return (arr.indexOf(obj) != -1);
    }    
    if (include($scope.toDelete, id)) {
      var index = $scope.toDelete.indexOf(id);
      $scope.toDelete.splice(index, 1);
    } else {
      $scope.toDelete.push(id);
    }        
  };
  
  $scope.removeSelected = function() {
    angular.forEach($scope.toDelete, function(value, key) {
      console.log(key, value);
      $http.delete('http://localhost:3000/api/Novedads/' + value)
        .success(function(data) {
          getNovedades();
        })
        .error(function(err) {
          console.log(err);
        });
    });
  };     
  
  $scope.result = "";
  
  $scope.download = function(name) {
    $window.location.assign('http://localhost:3000/api/containers/files/download/' + name + '.zip');
  };
  
  $scope.upload = function() {

      var fd = new FormData();

      angular.forEach($scope.file, function(file) {
        fd.append('file', file);
      });
      
     console.log($scope.file);

     console.log(fd);

     $http.post('/api/containers/files/upload',
        fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }
      ).success(function(d){
          console.log(d);
          $scope.result = "El archivo " + $scope.file[0].name + " se ha subido correctamente";
        })
        .error(function(e) {
          console.log(e);
        });
    };
		
});
	
myApp.directive('eaton', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('change', function() {
          $parse(attrs.eaton)
            .assign(scope, elm[0].files);
          scope.$apply();

          console.log(scope.file[0].name);
        });
      }
    }
  });
  
myApp.directive('zf', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('change', function() {
          $parse(attrs.zf)
            .assign(scope, elm[0].files);
          scope.$apply();

          console.log(scope.file[0].name);
        });
      }
    }
  });
  
myApp.directive('priceList', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, elm, attrs) {
        elm.bind('change', function() {
          $parse(attrs.priceList)
            .assign(scope, elm[0].files);
          scope.$apply();

          console.log(scope.file[0].name);
        });
      }
    }
  });