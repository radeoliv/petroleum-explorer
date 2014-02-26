/*--------------------------------------------------------------------------------
 Author: Shawn Eastwood

 seng515-petroleum-explorer

 =============================================================================
 Filename: visualization_controller.js
 =============================================================================
 Unit tests for visualizations.
 -------------------------------------------------------------------------------*/

require("../../app/scripts/visualization_controller.js")
console.log(exports.myVar);
/*function Oil_well_filter(oil_data, discrete_flag) {
	this.oil_data = oil_data;
	this.discrete_flag = discrete_flag;
};

Oil_well_filter.prototype.get_visualization_method = function () {
	return "histogram";
};*/


var assert = require("chai").assert;
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

	var oil_data_discrete_small_deviation = [
		"OIL",
		"OIL",
		"SUSPENDED OIL",
		"SUSPENDED OIL",
		"OIL",
		"OIL",
		"SUSPENDED OIL",
		"SUSPENDED OIL",
		"ABANDONED OIL"
	];

	//var oil_data_continuous = [

	var valid_visualizations = ["histogram", "pie-chart"]; // This is a list of the possible valid return values of Oil_well_filter.get_visualization_method.
	describe("visualization_controller", function () {
		it("empty data set, discrete data assumed", function () {
			//arrange
			var filter_controller = new Oil_well_filter(oil_data_empty, true);
			//act
			var actual = filter_controller.get_visualization_method();
			var expected = valid_visualizations;
			//assert
			assert.include(expected, actual);
		});

		it("empty data set, continuous data assumed", function () {
			//arrange
			var filter_controller = new Oil_well_filter(oil_data_empty, false);
			//act
			var actual = filter_controller.get_visualization_method();
			var expected = valid_visualizations;
			//assert
			assert.include(expected, actual);
		});

		it("Discrete data with a large deviation in frequencies.", function () {
			var filter_controller = new Oil_well_filter(oil_data_discrete_large_deviation, true);
			//act
			var actual = filter_controller.get_visualization_method();
			//Test passes if expected is "pie-chart-histogram".
			var expected = "pie-chart-histogram";
			//assert
			assert.equal(actual, expected);
		});

		it("Discrete data with a small deviation in frequencies.", function () {
			var filter_controller = new Oil_well_filter(oil_data_discrete_small_deviation, true);
			//act
			var actual = filter_controller.get_visualization_method();
			//Test passes if expected is "histogram".
			var expected = "histogram";
			//assert
			assert.equal(actual, expected);
		});

	});

})();
