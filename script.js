var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
  	$scope.ego=0;
  	$scope.pop=0;
  	$scope.active=0;
  	$scope.brevity=0;
  	$scope.thirst=0;
	$scope.hasToken = true;
	var token = window.location.hash;
	console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
	    	access_token:"244365755.234f2a2.b23f607d0e0c4b798955a55d55f5348d"
	    }
	  }).then(function(response) {
      $scope.picArray = response.data.data;
      console.log(response);
      // now analyze the sentiments and do some other analysis
      // on your images 
	  })
	};

	$scope.analyzeSentiments = function() {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
   		var totalLikes=0;
   		var egoCount=0;
   		var n=$scope.picArray.length;
   		var capLength=0;
    	for (var i=0;i<n;i++) {
    		totalLikes+=$scope.picArray[i].likes.count;
    		if ($scope.picArray[i].user_has_liked) egoCount++;
    		if ($scope.picArray[i].caption === null) {
    			console.log("no caption");
    		} else {
    			capLength+=$scope.picArray[i].caption.text.length;
    		}
    	}
    	$scope.pop=totalLikes/n;
    	$scope.ego=egoCount/n;
    	$scope.brevity=capLength/n;
	}


});