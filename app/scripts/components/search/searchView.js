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
	$searchInputSelector.on("keyup", function (e) { //retrieving the value in the input and saving it as a string variable
		var query = $(this).text(); //pass the search query to the search controller
		var results = this.searchController.findResults(query); // return json object back
		for (var result in results) {
			$resultsArea.html('<li class="result">' + result.UUID + '</li>'); // append results with uuids to the results container
			//TODO: show these corresponding pins
		}
	});
};

(typeof exports !== "undefined" && exports !== null ? exports : window).SearchView = SearchView;