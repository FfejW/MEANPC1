
angular.module('flapperNews', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home/{username}',
      templateUrl: '/home.html',
      controller: 'HomeCtrl',
		resolve: {
			user: ['$stateParams', 'auth', function ($stateParams, auth) {
				return auth.getUserProfile($stateParams.username);
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
    })
    .state('certifications', {
            url: '/certifications',
            templateUrl: '/certifications.html',
            controller: 'CertificationsCtrl',
            resolve: {
                certificationPromise: ['certifications', function (certifications) {
                        return certifications.getAll();
                    }]
            }
        })
	.state('profile', {
		url: '/users/{username}',
		templateUrl: '/profile.html',
		controller: 'UserCtrl',
		resolve: {
			user: ['$stateParams', 'auth', function ($stateParams, auth) {
				return auth.getUserProfile($stateParams.username);
			}]
		}
	});

  $urlRouterProvider.otherwise('home');
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
    currentUserDisplay: function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.displayname;
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
	},
    isEditable: function (course) {
        var token = auth.getToken();
                
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
                    
            return payload.username === course.author;
        } else {
            return false;
        }
    },
	addCertification: function(certification) {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return $http.post('/users/' + payload._id + '/certifications', certification, {
				headers: { Authorization: 'Bearer ' + auth.getToken() }
			});
		}
	},
    canEditCertifications: function () {
		var token = auth.getToken();

        if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.userType !== "Professional";
		} else {
			return false;
		}
    },
    isCertificationEditable: function (certification) {
        var token = auth.getToken();
                
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
                    
            return payload.username === certification.author;
        } else {
            return false;
        }
    },
	getUserProfile: function(username) {
		return $http.get('/users/' + username).then(function (res) {
			return res.data;
		});
	},
	update: function (user) {
		return $http.put('/users/' + user.username, user, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function (data) {
                //getUserProfile();
		});
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
			//o.courses.splice(o.courses.lastIndexOf(course), 1);
			//o.courses.push(data);
                o.getAll();
		});
	};

	return o;
 }])
.factory('certifications', ['$http', 'auth', function ($http, auth) {
        var o = {
            certifications: []
        };
        
        o.getAll = function () {
            return $http.get('/certifications').success(function (data) {
                angular.copy(data, o.certifications);
            });
        };
        
        o.create = function (certification) {
            return $http.post('/certifications', certification, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function (data) {
                o.certifications.push(data);
            });
        };
        
        o.delete = function (certification) {
            return $http.delete('/certifications/' + certification._id)
			.success(function () {
                o.certifications.splice(o.certifications.lastIndexOf(certification), 1);
            }, function (response) {
				//o fuck
            });
        }
        
        o.update = function (certification) {
            return $http.put('/certifications/' + certification._id, certification, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function (data) {
                o.getAll();
            });
        };
        
        return o;
    }])
.controller('MainCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.user = auth.getUserProfile;
  $scope.isLoggedIn = auth.isLoggedIn;
}])
.controller('HomeCtrl', [
    '$scope',
    'user',
    'auth',
    function ($scope, user, auth) {
        $scope.user = user;
        $scope.isLoggedIn = auth.isLoggedIn;
    }])
.controller('UserCtrl', [
	'$scope',
	'user',
	'auth',
	function ($scope, user, auth) {
		$scope.user = user;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.isEditMode = false;
		$scope.isNameEditMode = false;
        $scope.orignalUser = user;
        
        //foreach cert, aggregate related courses
        
        //can i just pass the $scope.user object to the update function?
		$scope.editUser = function() {
			auth.update({
                username: $scope.user.username,
                displayname: $scope.user.displayname,
				bio: $scope.user.bio
			});

			$scope.orignalUser = user;
		}
		$scope.cancelUpdate = function () {
			$scope.user = $scope.orignalUser;
		}
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
  $scope.currentUserDisplay = auth.currentUserDisplay;
  $scope.logOut = auth.logOut;
}])
.controller('CoursesCtrl', [
	'$scope',
	'courses',
    'auth',
    'certifications',
	function ($scope, courses, auth, certifications) {
		$scope.courses = courses.courses;
        $scope.certifications = certifications.getAll();
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
            $scope.courses = courses.courses;
		}

		$scope.addCourseToUser = function (course) {
			auth.addCourse(course);
        }

        $scope.isEditable = function (course){
            return auth.isEditable(course);// === course.author;
        }
    }])
.controller('CertificationsCtrl', [
    '$scope',
    'certifications',
    'auth',
    function ($scope, certifications, auth) {
        $scope.certifications = certifications.certifications;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.canEditCertifications = auth.canEditCertifications;
        
        $scope.addCertification = function () {
            if ($scope.certificationTitle === '') { return; }
            certifications.create({
                title: $scope.certificationTitle,
                description: $scope.certificationDescription
            });
            $scope.certificationTitle = '';
            $scope.certificationDescription = '';
        };
        
        $scope.removeCertification = function (certification) {
            certifications.delete(certification);
        }
        
        $scope.getCertificationForEdit = function (certification) {
            $scope.certificationIdEdit = certification._id;
            $scope.certificationTitleEdit = certification.title;
            $scope.certificationDescriptionEdit = certification.description;
            $scope.showEdit = true;
        }
        
        $scope.editCertification = function () {
            certifications.update({
                _id: $scope.certificationIdEdit,
                description: $scope.certificationDescriptionEdit
            });
            $scope.certificationTitleEdit = '';
            $scope.certificationDescriptionEdit = '';
            $scope.certifications = certifications.certifications;
        }
        
        $scope.addCertificationToUser = function (certification) {
            auth.addCertification(certification);
        }
        
        $scope.isEditable = function (certification) {
            return auth.isCertificationEditable(certification);// === certification.author;
        }
    }]);
