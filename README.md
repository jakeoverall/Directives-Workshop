Directives-Workshop
===================
Angular allows us to create these great things called directives. Directives are essentially small pieces of functionality our app needs that can be bundled up into individual components. 

These components allow us to reuse code within our project, and throughout other projects. Creating your own directives can be odd at first because we will be using a lot of built in Angular functionality to do this. For now consider these things as autoMagical and then once you've created a few go look into how Angular is interpreting the directive.



#The Anatomy of an Angular Directive - a reference.
````javascript
	var app = angular.module('NAME-OF-APP', []);

	app.directive('nameOfDirective', function() {
		//our directive's name 'nameOfDirective' will be 
		//parsed to show up as 'name-of-directive' in our HTML.

		return {
			  //you have 4 restrict options. You can use any of the 4 in any combonation.
			  //{'E': 'Element', 'A': 'Attribute', 'C': 'Class', 'M': 'Comment'}
			  //typically we create them as Elements or Attributes.
			restrict: 'EA',
			scope: {
				name: '=name' //The name of the directives scope and be set
			},				  //in the name attribute on the directive's element.
			template: '<div><h1>Hello World</h1></div>', 
			  // the template can take raw HTML, or a file path that leads to an HTML file.
			  // Like so:
			templateUrl: 'app/views/directiveView.html',

			controller: function($scope) { //We can create a controller in our directive!
				$scope.test = 'OMG!';
			},
			  //this allows us to a special controller that nothing else can touch. 
			replace: true, //If we are using a template, we can choose to 
			  //insert it's value wherever we call the directive.
			link: function(scope, elem, attr) {
		          // scope is the directive's scope,
		          // elem is a jquery lite (or jquery full) object for the directive root element.
		          // attr is a dictionary of attributes on the directive element.
		      elem.bind('dblclick', function() {

		      });
		    }
		}

	})
````

###Note:
Most of these attributes within the directive example above are optional. For more information about directives visit the documentation at: https://docs.angularjs.org/guide/directive


###Walkthrough
If you dig through the angular documentation and as you become more familiar with directives you will notice that angular is heavily dependent in its use of directives. A few example directives that you use all the time even if you weren't aware of it are: 

+ ng-app
+ ng-view
+ ng-repeat
+ ng-click
+ ect...

####Step 1

We are now going to embrace the modularity of angular and create our first reusable module. This means that the custom directive that you write here will be easy to reuse in all of your projects by simply injecting your module into your apps dependencies. To get started lets create a new and setup our angular module. 

<i>myDirectives.js</i>

  var app = angular.module('myDirectives', []);
  
You are familiar with creating controllers, factories, and services already and the markup for starting a directive looks very similar. 
````javascript
  app.directive('camelCase', function(){
    //directive stuff here...
  });
````

####Dont get tripped up.
Despite looking just like a controller or a service there are a few things to be cautious of when working with directives. The first is naming conventions. Remember that Javascript conventions say we should use camelCase while Html conventions state that we should use snake-case. Angular trying to keep with best practices holds true to these conventions so whatever you name your directive here will later be called in your Html using snake-case

````html
  ex. <div camel-case></div>
  ex. <div ng-view></div>
````

Angular handles the conversion of your naming process itself so you don't have to worry about it, however if you didn't know it was happening you would have a very hard time debugging your code.  

###Step 2

####pending Directive
Now that we have created our basic setup lets focus on building a directive that we can put on a <button></button> element that will show a loading gif while we wait for our data from an $http request. Lets create a new directive on our app and lets give it the name 'pending'. We then will setup the basic anatomy of a directive.

````javascript
  return {
    restrict: 'AE',
    scope: {},
    link: function(){
      //Code Here
    }
  }
````

Notice a directive is a really a function that is returning an object, and on this object we are adding some very specific keys that are specific to directives, we just need to take advantage of them. Thinking about our needs in creating a spinner we are going to restrict our directive to an attribute.

We are also going to use isolate scope to ensure that our code is modular however we are going to want our directive to have access to the controller that it is used in. For example if we look at this example where we are sending a request to Itunes and returning an array of songs we are going to want to still call the function getSongs() when this button is clicked. To do this we need to pass in some keys to our scope object.

````html
	<button class="btn btn-primary" ng-click="getSongData()"> Submit </button>
````

What we need is a way to grab the function that is being called with ng-click. We will do this by setting up a key in our scope object called request: Now because we are wanting to run the function directly as it is called from our controller we are going to set request: '&' This may look funny but we are letting angular handle the complexities of going to the $parent scope and getting the function that we want to call. Now we will modify our html a bit to handle this change.

````html
	<button class="btn btn-primary" pending request="getSongData()"> Submit </button>
````

Notice that we have removed ng-click because it is no longer necessary as we will be calling the getSongData() from the directive's scope key request. 

Now go ahead and setup the link block. This link block is very important when it comes to creating useful directives. It is through the link function that we ge access to three very important things the first is scope. 

#####A note about scope
When we talk about scope we are often refering to what block of code we are currently residing in and it is through scope that we have access to our variables and functions. What is important to understand when working with directives is that we often want to make sure we have an isolated scope so we know that our directive can be modular and not dependent upon a function or variable inside of a parent scope. The directive needs to hold all of its own functionality. This concept is not to be confused with being unable to use or take in functions or variables from a controller or parent scope and manipulate them. Think about ng-repeat="item in list" this is a directive that is taking in a $scope.variable called list and iterating through each item in that array therefore it must have access to the controller where $scope.list is defined. 

Using scope appropriately and understanding how far down a scope tree you are can be confusing and difficult so it is okay to struggle with this concept. 

Next we pass in element, or elem. This is the actual DOM element where we added our attribute pending. It is through the element that we can perform DOM manipulation in a way that might look and feel familiar to JQuery. The last thing we pass in will be attributes or attr/attrs. This gives us access to the attributes that are on the element.

````javascript
	link: function(scope, elem, attrs){
	
	}
````
Inside our link block we can write the code necessary to show our pending spinner while we are fetching data from our server. Try console.log(scope, elem, attrs) to get a good look at the things you have available to you. There are many ways to accomplish this next task so play with a few things to try and get it right. 

*Hints

+ Hide, disable, or change the text of the submit button
+ Show a spinning icon or gif while we wait for our data
+ Hide the spinner when our data returns
+ Reset the submit button to its original condition
+ You may need to use $q and setup some promises
+ Inject $q into the directive not the link function
+ remember scope.request === to the function on the controller.
+ Don't let your controller function start until the "element" is "clicked"
+ Make sure your controller function is returning itself and its promise.
+ This will be difficult don't give up. Tackle one problem at a time.

###Step 3

####Notify Directive

Now that you have a super cool directive that you can drop in anytime you need to make a call to a server lets make another directive that will be just as reusable as the last. Make sure you look up Html5 Notifications. They are built into most modern browsers and can therefore be very helpful for notifying us when an event occurs. Think of DevQueue wouldn't it be nice if Mentors got a small notification whenever a student enters the Queue? With this directive we should be able to accomplish that task fairly easily. 

Go ahead and setup a brand new directive and lets call it 'notify'. The setup here will be alot like our pending directive however the link function will be what changes. Follow the same process as before and then put this in as a freebie at the top of your link function. Although most modern browsers have built in notifications and they pretty much all function the same way they are not stored in the same location on the window so we are going to setup a simple or statement that will help make sure we are using the correct notification for each browser. Because it would be annoying for any site to give you popup notifications without your consent users have to grant permission to receive notifications. This permission is saved as a cookie so it will remember the setting each time you go to the site. Because it uses Cookies make sure you use something like http-server when testing. 

````javascript
	var Notification = window.Notification || window.mozNotification || window.webkitNotification;
	Notification.requestPermission(function (permission) {
				//console.log(permission);
			});
````
Moving right along if you look console.log(Notification) you would see that in each of these browsers Notification is a constructor. Remember in Js constructors use an initial capital letter. This means that for each notification we will be creating an 'new Notification()' instance. This constructor is setup to take in two parameters a string for its title and then an object with the rest of its properties. (title, {body: '', icon: ''}). Practice getting these notifications to work first with some hard coded values, then think about what you have learned to pass in variables that are on $scope from your controller. 

*Hints

+ Utilize scope {title: '=', body: '=', icon: '='}
+ Remember to setup your Html with the correct naming conventions
+ Create a function that can be called on elem.click()
+ Use a callback in elem.click() to pass your params to the Notification Constructor
+ Again This will be difficult don't give up. Tackle one problem at a time. Use your resources.


###Step 4

Because you wrote some super cool directives go back to some of your previous projects and add in your myDirectives.js and don't forget to inject your module as a dependency angular.module('Itunes', ['ngGrid', 'myDirectives']) Then just drop into the Html add in the required attributes and watch your directives work seamlessly.
