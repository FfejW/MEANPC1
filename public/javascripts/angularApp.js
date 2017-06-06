
angular.module('flapperNews', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('courses', {
		url: '/courses',
		templateUrl: '/courses.html',
		controller: 'CoursesCtrl',
		resolve: {
			coursePromise: ['courses', function(courses) {
				return courses.getAll();
			}]
		}
    });

  $urlRouterProvider.otherwise('home');
}])
.factory('posts', ['$http', 'auth', function($http, auth){
  var o = {
    posts: []
  };

  o.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post) {
    return $http.post('/posts', post, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.posts.push(data);
    });
  };

  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      post.upvotes += 1;
    });
  };

  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.upvotes += 1;
    });
  };

  return o;
}])
.factory('auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
   var auth = {
    saveToken: function (token){
      $window.localStorage['flapper-news-token'] = token;
    },
    getToken: function (){
      return $window.localStorage['flapper-news-token'];
    },
    isLoggedIn: function(){
      var token = auth.getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    },
    currentUser: function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
      }
    },
    register: function(user){
      return $http.post('/register', user).success(function(data){
        auth.saveToken(data.token);
      });
    },
    logIn: function(user){
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    },
    logOut: function(){
      $window.localStorage.removeItem('flapper-news-token');
    },
    canEditCourses: function () {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.userType !== "Professional";
		} else {
			return false;
		}
    },
	addCourse: function(course) {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return $http.post('/users/' + payload._id + '/courses', course, {
				headers: { Authorization: 'Bearer ' + auth.getToken() }
			});
		}
	}
  };

  return auth;
}])
.factory('courses', ['$http', 'auth', function ($http, auth) {
	var o = {
		courses: []
	};

	o.getAll = function () {
		return $http.get('/courses').success(function (data) {
			angular.copy(data, o.courses);
		});
	};

	o.create = function (course) {
		return $http.post('/courses', course, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function (data) {
			o.courses.push(data);
		});
	};

	o.delete = function(course) {
		return $http.delete('/courses/' + course._id)
			.success(function() {
				o.courses.splice(o.courses.lastIndexOf(course), 1);
			}, function(response) {
				//o fuck
			});
	}

	o.update = function (course) {
		return $http.put('/courses/' + course._id, course, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function (data) {
			o.courses.splice(o.courses.lastIndexOf(course), 1);
			o.courses.push(data);
		});
	};

	return o;
}])
.controller('MainCtrl', [
'$scope',
'posts',
'auth',
function($scope, posts, auth){
  $scope.test = 'Hello world!';

  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addPost = function(){
    if($scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };

  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };

}])
.controller('PostsCtrl', [
'$scope',
'posts',
'post',
'auth',
function($scope, posts, post, auth){
  $scope.post = post;
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addComment = function(){
    if($scope.body === '') { return; }
    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };

  $scope.incrementUpvotes = function(comment){
    posts.upvoteComment(post, comment);
  };
}])
.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};
  $scope.userTypes = [
	  { name: "Select One", type: "Admin" },
	  { name: "Professional", type: "Professional" },
	  { name: "Provider", type: "Provider"}
  ];
  $scope.user.userType = $scope.userTypes[0].name;

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])
.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}])
.controller('CoursesCtrl', [
	'$scope',
	'courses',
	'auth',
	function ($scope, courses, auth) {
		$scope.courses = courses.courses;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.canEditCourses = auth.canEditCourses;

		$scope.addCourse = function () {
			if ($scope.courseTitle === '') { return; }
			courses.create({
				title: $scope.courseTitle,
				description: $scope.courseDescription
			});
			$scope.courseTitle = '';
			$scope.courseDescription = '';
		};

		$scope.addCourse = function () {
			if ($scope.courseTitle === '') { return; }
			courses.create({
				description: $scope.courseDescription
			});
			$scope.courseTitleEdit = '';
			$scope.courseDescriptionEdit = '';
		};

		$scope.removeCourse = function(course) {
			courses.delete(course);
		}

		$scope.getCourseForEdit = function (course) {
			$scope.courseIdEdit = course._id;
			$scope.courseTitleEdit = course.title;
			$scope.courseDescriptionEdit = course.description;
			$scope.showEdit = true;
		}

		$scope.editCourse = function() {
			courses.update({
				_id: $scope.courseIdEdit,
				description: $scope.courseDescriptionEdit
			});
			$scope.courseTitleEdit = '';
			$scope.courseDescriptionEdit = '';
		}

		$scope.addCourseToUser = function (course) {
			auth.addCourse(course);
		}
	}]);
