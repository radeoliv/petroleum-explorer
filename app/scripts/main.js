/*--------------------------------------------------------------------------------
 Author: robinbesson

 petroleum-explorer

 =============================================================================
 Filename: Main.js
 =============================================================================
 Creates all the used classes (controllers and views).
 -------------------------------------------------------------------------------*/

jQuery(document).ready(function ($) {
	/*
	 * The data set is retrieved from the database from the map-canvas script.
	 * It can be used in the other parts of the system, avoiding having to reload everything.
	 */
	var myMapCanvasController = new MapCanvasController();
	var dataSet = myMapCanvasController.getDataSet();

	var mySearchController = new SearchController(dataSet, []);
	var mySearchView = new SearchView(mySearchController, myMapCanvasController);

	var $searchQueryForm = $(".search-form form"),
		$searchQueryInput = $($searchQueryForm.find("input[type='search']"));
	mySearchView.listenKeyboard($searchQueryInput, $searchQueryForm);

	var $fullTableContainer = $(".search-results-table");
	var myTableController = new FullTable(mySearchController, myMapCanvasController, $fullTableContainer);
	myMapCanvasController.setFullTable(myTableController);

	var myExportController = new ExportController(myTableController);
	var myExportView = new ExportView(myExportController);

	var myVisualizationController = new VisualizationController(myMapCanvasController);
	var myVisualizationView = new VisualizationView(myVisualizationController, myTableController);

	var myPolygonSelection = new PolygonSelection(myMapCanvasController, mySearchController);

	var myClassificationController = new ClassificationController(myMapCanvasController);
	var myClassificationView = new ClassificationView(myClassificationController);
});