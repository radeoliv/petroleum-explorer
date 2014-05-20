/*--------------------------------------------------------------------------------
 Author: robinbesson

 petroleum-explorer

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
	var myVisualizationCustom = new Visualization_custom();
	var myGraphSelection = new GraphSelection(mySearchController, myVisualizationCustom);

	var mySearchView = new SearchView(mySearchController, myMapCanvasController, myGraphSelection);

	var $searchQueryForm = $(".search-form form"),
		$searchQueryInput = $($searchQueryForm.find("input[type='search']"));

	var $fullTableContainer = $(".search-results-table");
	var myTableController = new FullTable(mySearchController, myMapCanvasController, $fullTableContainer);
	myMapCanvasController.setFullTable(myTableController);

	mySearchView.listenKeyboard($searchQueryInput, $searchQueryForm);

	var myExportController = new ExportController(myTableController);
	var myExportView = new ExportView(myExportController);

	var myVisualizationView = new VisualizationView();
});