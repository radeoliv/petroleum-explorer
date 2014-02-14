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
	var oil_data_empty = [];
	var oil_data_discrete_large_deviation = [
			"SUSPENDED OIL",
			"OIL",
			"SUSPENDED OIL",
			"OIL",
			"OIL",
			"SUSPENDED OIL",
			"SUSPENDED OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"SUSPENDED OIL",
			"OIL",
			"OIL",
			"OIL",
			"ABANDONED OIL",
			"OIL"
		];

		var valid_visualizations = ["histogram", "bar-graph", "pie-chart-histogram" , "pie-chart"];
	describe("visualization_controller", function () {
		it("empty data set, discrete data assumed", function () {
			//arrange
			var filter_controller = new oil_well_filter(oil_data_empty, true);
			//act
			var actual = filter_controller.get_visualization_method();
			var expected = valid_visualizations;
			//assert
			assert.include(expected, actual);
		});

		it("empty data set, continuous data assumed", function () {
			//arrange
			var filter_controller = new oil_well_filter(oil_data_empty, false);
			//act
			var actual = filter_controller.get_visualization_method();
			var expected = valid_visualizations;
			//assert
			assert.include(expected, actual);
		});

		it("returns a valid visualization type", function () {
			var filter_controller = new oil_well_filter(oil_data_discrete_large_deviation, true);
			//act
			var actual = filter_controller.get_visualization_method();
			//Test passes if expected is any of the valid visualization types
			// (string) any one of "histogram", "bar-graph", "pie-chart-histogram", "pie-chart"
			var expected = valid_visualizations;
			//assert
			assert.include(expected, actual);
		});

	});

})();
