var app = angular.module('myDirectives', []);
app.directive('pending', function($q){
	return {
		restrict: 'A',
		scope: {
			doIt: '&'
		},
		link: function(scope, elem, attrs){
			var spinner = angular.element("<button class='btn disabled'><i class='icon-refresh icon-spin'></i> Doing...</button>").hide();
			elem.after(spinner);

			elem.click(function(){
				spinner.show();
				elem.hide();
				getData()
					.then(function(data){
						spinner.hide();
						elem.show();
					})
			});
			
			var getData = function(){
				var deferred = $q.defer();
				scope.doIt()
					.then(function(data){
						deferred.resolve(data)
					});
				return deferred.promise;
			}
		}
	}
});

app.directive('notify', function($window){
	return{
		restrict: 'A',
		scope: {
			title:"@",
			body: "=",
			icon: "@"
		},
		link: function(scope, elem, attrs){

			var Notification = window.Notification || window.mozNotification || window.webkitNotification;

			Notification.requestPermission(function (permission) {
				//console.log(permission);
			});

			elem.click(function(){
				show();
			});

			var show = function() {
				debugger;
				var instance = new Notification(scope.title, { body: scope.body || '', icon: scope.icon || '' });

				instance.onclick = function () {
					// Something to do
				};
				instance.onerror = function () {
					// Something to do
				};
				instance.onshow = function () {
					// Something to do
				};
				instance.onclose = function () {
					// Something to do
				};
				return false;
			};
		}
	};
});
