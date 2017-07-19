

	var myApp = angular.module('myApp', ['ngRoute']);

	
	myApp.config(function($routeProvider) {
		$routeProvider

			
			.when('/', {
				templateUrl : 'home.html',
				controller  : 'mainController'
			})

			
			.when('/about', {
				templateUrl : 'about.html',
				controller  : 'aboutController'
			})

			
			.when('/search', {
				templateUrl : 'search.html',
				controller  : 'searchController'
			});
	});

	
	myApp.controller('mainController', function($scope) {
		$scope.message = 'Welcome to Places Search Project';
	});

	myApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	myApp.controller('searchController', function($scope) {
		$scope.message = 'Enter place name:';
	});
	

myApp.service('Map', function($q) {
    
    this.init = function() {
        var options = {
            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
            zoom: 13,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});

myApp.controller('newPlaceController', function($scope, Map, $http) {
    
    $scope.place = {};
    
    $scope.search = function() {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res) { 
                Map.addMarker(res);
                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
                var appid = 'key=237efe68e53d465085c44041171907';
                var api_search= 'https://api.apixu.com/v1/current.json?';
                var url = api_search + appid + '&q='+ res.name;
                
                $http.get(url).then(function(response){
                	var weather_data = response.data;
                	$scope.weathers = weather_data;
                	$scope.search_location ='Location Name:'+ weather_data.location.name + ', Region:'+weather_data.location.region;
                	$scope.temp_c ='Temperature by C:' + weather_data.current.temp_c;
                	$scope.wind_degree ='Wind Degree:' + weather_data.current.wind_degree;
                	$scope.wind_dir ='Wind Direction: ' + weather_data.current.wind_dir;
                	$scope.pressure_mb ='Pressure by mb:' + weather_data.current.pressure_mb;
                	$scope.humidity = 'Humidity:' + weather_data.current.humidity;
                	$scope.condition = 'Condition:' + weather_data.current.condition.text;
                })
                
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    };
    
    $scope.send = function() {
        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);
        
    }
    
    
    Map.init();
});
