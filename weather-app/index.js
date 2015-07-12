var app = angular.module('weather', []);

app
  .controller('WeatherCtrl', function (WeatherService) {
    var vm = this;
    vm.title = "Local Weather App";
    vm.isCelsius = true;
    vm.init = function () {
      WeatherService.getLocation()
        .then(WeatherService.getWeather)
        .then(function (data) {
          vm.weatherData = {
            city: data.name,
            temp: (data.main.temp - 273.15).toFixed(2),
            temp_max: (data.main.temp_max - 273.15).toFixed(2),
            temp_min: (data.main.temp_min - 273.15).toFixed(2),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind_speed: data.wind.speed,
            condition: data.weather[0].id === 800 || data.weather[0].id === 801? 'Sunny' : data.weather[0].main
          };
          vm.weatherIcon = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
        })
        .catch (function (e) {
          console.log(e);
        });
    };
    vm.background = function () {
      var bg = {
        Thunderstorm: 'bg-thunderstorm',
        Drizzle: 'bg-drizzle',
        Rain: 'bg-rain',
        Snow: 'bg-snow',
        Atomosphere: 'bg-atomosphere',
        Clouds: 'bg-clouds',
        Sunny: 'bg-sunny',
        Extreme: 'bg-extreme'
      };
      return vm.weatherData? bg[vm.weatherData.condition] : '';
    };
    vm.changeTempDisplay = function () {
      if (!vm.isCelsius) {
        vm.weatherData.temp = toFahrenheit(vm.weatherData.temp);
        vm.weatherData.temp_max = toFahrenheit(vm.weatherData.temp_max);
        vm.weatherData.temp_min = toFahrenheit(vm.weatherData.temp_min);
      }
      else {
        vm.weatherData.temp = toCelsius(vm.weatherData.temp);
        vm.weatherData.temp_max = toCelsius(vm.weatherData.temp_max);
        vm.weatherData.temp_min = toCelsius(vm.weatherData.temp_min);
      }
    };
    
    vm.init();
  
    function toCelsius(temp) {
      return ((temp - 32) / 1.8).toFixed(2);
    }
    
    function toFahrenheit(temp) {
      return (temp * 1.8 + 32).toFixed(2);
    }
  })
  .service('WeatherService', function ($window, $http, $q) {
    this.getLocation = function () {
      var defer = $q.defer();
      if (!navigator.geolocation){
        return "Geolocation is not supported by your browser";
      }
      navigator.geolocation.getCurrentPosition(function (position) {
        defer.resolve(position);
      }, function (e) {
        defer.reject('get current location failed');
      });
      return defer.promise;
    };
    
    this.getWeather = function (positions) {
      var defer = $q.defer();
      var latitude  = positions.coords.latitude;
      var longitude = positions.coords.longitude;
      $http.jsonp('http://api.openweathermap.org/data/2.1/find/city?lat=' + latitude + '&lon=' + longitude + '&cnt=1&callback=JSON_CALLBACK')
      .success(function (data) {
        if (data.list && data.list.length > 0) {
          defer.resolve(data.list[0]);
        }
        else {
          defer.reject('No weather data found');
        }
      })
      .error(function (data, status) {
        defer.reject('Get weather information failed');
      });
      return defer.promise;
    };
  });