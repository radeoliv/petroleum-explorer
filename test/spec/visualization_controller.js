 /*--------------------------------------------------------------------------------
	Author: Shawn Eastwood

	seng515-petroleum-explorer

	=============================================================================
	Filename: visualization_controller.js
	=============================================================================
	Unit tests for visualizations.
-------------------------------------------------------------------------------*/

 (function () {
	 "use strict";
	var oil_data = {
		// todo: fill in with sample data
	},
		valid_visualizations = ["bar-graph", "pie-chart", "circle-graph"];
	 describe("visualization_controller", function () {
		 it("returns a valid visualization type", function () {
			 var filter_controller = new oil_well_filter(oil_data);
			 //act
			 var actual = filter_controller.get_visualization_method();
			 //TODO: Test passes if expected is any of the valid visualization types
			 // (string) any one of "bar-graph", "pie-chart", "circle-chart"
			 var expected = valid_visualizations;
			 //assert
			 assert.include(expected, actual);
		 });

	 });

 })();
