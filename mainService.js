var app = angular.module('directiveWorkshop');

app.service('mainService', function($http){
	this.getData = function(artist) {
        return $http({'method': 'JSONP', 'url': 'https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK' })
            .then(function (data) {
                return data;
            });
    };
})