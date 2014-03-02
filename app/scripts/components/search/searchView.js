
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
SearchView = function (searchController){
	//TODO: create constructor for searchview
	this.searchController = searchController
};


 /**
  * listen to key down events
  * send query to the searchController
   * @param $searchInputSelector jquery selector likely input[type="search"]
  * @param $searchInputForm housing form of search input
  */
SearchView.prototype.listenKeyboard = function($searchInputSelector,$searchInputForm){
	$searchInputSelector..on("keydown", function (e) {
		//retrieving the value in the input and saving it as a string variable
		var query = $(this).text();
		//pass the search query to the search controller
		this.searchController.findResults(query);
	});
}
