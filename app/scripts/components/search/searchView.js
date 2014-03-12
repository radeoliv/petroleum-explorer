/*--------------------------------------------------------------------------------
 Author: robinbesson
 www: http://seangoresht.com/
 github: https://github.com/srsgores

 twitter: http://twitter.com/S.Goresht

 seng515-petroleum-explorer
 Do What the Fuck You Want License

 =============================================================================
 Filename:
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/
var SearchView;
SearchView = function (searchController) {
	//TODO: create constructor for searchview
	this.searchController = searchController
};

/**
 * listen to key down events
 * send query to the searchController
 * @param $searchInputSelector jquery selector likely input[type="search"]
 * @param $searchInputForm housing form of search input
 */
SearchView.prototype.listenKeyboard = function ($searchInputSelector, $searchInputForm) {
	var $resultsArea = $('<ul class="results"></ul>').appendTo($searchInputForm); //append the results container if javascript enabled
	var lsdSearchInput = $searchInputForm.find("input[name='lsd']"),
		sectionSearchInput = $searchInputForm.find("input[name='section']"),
		townshipSearchInput = $searchInputForm.find("input[name='township']"),
		rangeSearchInput = $searchInputForm.find("input[name='range']");
	var self = this;
	$searchInputSelector.on("keyup", function (e) { //retrieving the value in the input and saving it as a string variable.  Whenever a search input has typed in it, performs the search
		var lsdQuery=lsdSearchInput[0].value;
		var sectionQuery=sectionSearchInput[0].value;
		var townshipQuery=townshipSearchInput[0].value;
		var rangeQuery=rangeSearchInput[0].value;
		if(townshipQuery.length ===3 && rangeQuery.length === 2){
			var results = self.searchController.findResults(lsdQuery,sectionQuery,townshipQuery,rangeQuery); // return json object back
			var searchOutputHtml = '';
			for (var i=0;i<results.length;i++) {
				console.log(results[i]);
				searchOutputHtml += '<li class="result">' + "<span class='UWI'>" + results[i]['UWI'] + "</span>" + '</li>';
				//$resultsArea.html.('<li class="result">' + results[i] + '</li>'); // append results with uuids to the results container
				//TODO: show these corresponding pins
			}
			$resultsArea.html(searchOutputHtml);
		}

	});


};

(typeof exports !== "undefined" && exports !== null ? exports : window).SearchView = SearchView;