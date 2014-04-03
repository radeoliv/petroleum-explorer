/*--------------------------------------------------------------------------------
 Author: robinbesson

 seng515-petroleum-explorer

 =============================================================================
 Filename: Main.js
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

	function loadMapCanvasController() {
		window.mapCanvas_controller === null || window.mapCanvas_controller === 'undefined' ? alert('map canvas controller has not been loaded') : console.log('map canvas controller loaded');

		return new MapCanvasController();
	}

	var mySearchController = loadSearchController();
	var myMapCanvasController = loadMapCanvasController()
	var mySearchView = new SearchView(mySearchController, myMapCanvasController)
	var $searchQueryForm = $(".search-form form"),
		$searchQueryInput = $($searchQueryForm.find("input[type='search']"));
	// load in datatable
	var $fullTableContainer = $(".full-results-table"),
		myTableController = new FullTable(mySearchController, $fullTableContainer);
	mySearchView.listenKeyboard($searchQueryInput, $searchQueryForm);
	//var $visualization_view = new Visualization_View($fullTableContainer)
});