/*--------------------------------------------------------------------------------
 Author: robinbesson

 seng515-petroleum-explorer

 =============================================================================
 Filename: Main.js
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/

jQuery(document).ready(function ($) {
	var dataSet;

	function loadSearchController() {

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
	var myMapCanvasController = new MapCanvasController();

	var mySearchView = new SearchView(mySearchController, myMapCanvasController);

	var $searchQueryForm = $(".search-form form"),
		$searchQueryInput = $($searchQueryForm.find("input[type='search']"));

	var $fullTableContainer = $(".search-results-table");
	var myTableController = new FullTable(mySearchController, myMapCanvasController, $fullTableContainer);

	mySearchView.listenKeyboard($searchQueryInput, $searchQueryForm);

	//var $visualization_view = new Visualization_View($fullTableContainer)
});