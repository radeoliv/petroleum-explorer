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



jQuery(document).ready(function ($) {
	function loadSearchController() {
		window.search_controller === null || window.search_controller === 'undefined' ? alert('search controller has not been loaded') : console.log('search controller loaded');
		var dataSet;
		//parse JSON file with all informations about wells
		$.ajax({
			url: './wells.json',
			dataType:'json',
			async: false,
			success: function(data){
				dataSet = data;
			}
		});
		return new SearchController(dataSet, []);
	}
	var mySearchController = loadSearchController();
	var mySearchView = new SearchView(mySearchController);
	var $searchQueryForm = $(".search-form form"),
		$searchQueryInput = $($searchQueryForm.find("input[type='search']"));
	// load in datatable
	var $fullTableContainer = $(".full-results-table"),
		myTableController = new FullTable(mySearchController, $fullTableContainer);
	mySearchView.listenKeyboard($searchQueryInput, $searchQueryForm);
});