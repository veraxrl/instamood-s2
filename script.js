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

  $scope.dateCount = [0,0,0,0,0,0,0];
  $scope.days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  $scope.unixConversion = function(unix_timestramp) {
      var a = new Date(unix_timestramp*1000);
      var dayOfWeek = $scope.days[a.getDay()];
      //console.log(dayOfWeek);
      for (var i=0;i<$scope.days.length;i++) {
          if (dayOfWeek===$scope.days[i]) $scope.dateCount[i]++;
      }
  }

  $scope.getStats = function() {
      var totalLikes=0;
      var egoCount=0;
      var n=$scope.picArray.length;
      var capLength=0;
      var numTag=0;
      for (var i=0;i<n;i++) {
        //Calculate most accurate day of the week:
        var unix_timestramp=$scope.picArray[i].created_time;
        $scope.unixConversion(unix_timestramp);

        totalLikes+=$scope.picArray[i].likes.count;
        if ($scope.picArray[i].user_has_liked) egoCount++;
        if ($scope.picArray[i].caption !== null) {
          capLength+=$scope.picArray[i].caption.text.length;
        }
        numTag+=$scope.picArray[i].tags.length;
      }
      $scope.pop=totalLikes/n;
      $scope.ego=egoCount/n;
      $scope.brevity=capLength/n;
      $scope.thirst=numTag/n;
      //activity calculation:
      //console.log($scope.dateCount);
      var max=$scope.dateCount[0];
      var idx=0;
      for (var i=1;i<7;i++) {
        if ($scope.dateCount[i]>max) idx=i;
      }
      $scope.active=$scope.days[idx];
  }

	$scope.analyzeSentiments = function() {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
    $http({
      url: "https://twinword-sentiment-analysis.p.mashape.com/analyze/",
      method:"GET",
      params: {
        
      }
    }).then(function(response) {
      console.log(response);
    })

	}


});