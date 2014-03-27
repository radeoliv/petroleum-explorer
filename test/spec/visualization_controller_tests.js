/*--------------------------------------------------------------------------------
 Author: Shawn Eastwood

 seng515-petroleum-explorer

 =============================================================================
 Filename: visualization_controller_tests.js
 =============================================================================
 Unit tests for Oil_well_filter.
 -------------------------------------------------------------------------------*/

var Oil_well_filter = require("../../app/scripts/visualization_controller.js");

var assert = require("chai").assert;
(function () {
	"use strict";

	var valid_visualizations = ["histogram", "pie-chart"]; // This is a list of the possible valid return values of Oil_well_filter.get_visualization_method.

	describe("visualization_controller", function () {
		it("empty data set, should return error message", function() {
			//arrange
			var filter_controller = new Oil_well_filter.Oil_well_filter([], true);
			//act
			var actual = filter_controller.get_visualization_method();
			var expected = "Data set cannot be empty.";
			//assert
			assert.equal(actual, expected);
		});

		//For a single element data set, there is just one category, a histogram is used and the bar is completely suppressed as there is no deviation in counts.
		it("single element data set, discrete data assumed", function () {
			//arrange
			var filter_controller = new Oil_well_filter.Oil_well_filter(["A"], true);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var actual_5 = filter_controller.start;
			var actual_6 = filter_controller.end;
			var expected_1 = "histogram"; // The default visualization method.
			var expected_2 = 1;
			var expected_3 = ["A"];
			var expected_4 = [1];
			var expected_5 = 1;
			var expected_6 = 2;
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.deepEqual(actual_3, expected_3);
			assert.deepEqual(actual_4, expected_4);
			assert.equal(actual_5, expected_5);
			assert.equal(actual_6, expected_6);
		});

		it("single element data set, continuous data assumed", function () {
			//arrange
			var filter_controller = new Oil_well_filter.Oil_well_filter([5.0], false);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var actual_5 = filter_controller.start;
			var actual_6 = filter_controller.end;
			var actual_7 = filter_controller.startpoint;
			var actual_8 = filter_controller.endpoint;
			var actual_9 = filter_controller.category_widths;
			var expected_1 = "histogram"; // The default visualization method.
			var expected_2 = 1;
			var expected_3 = ["[4.995,5.005)"];
			var expected_4 = [1];
			var expected_5 = 1;
			var expected_6 = 2;
			var expected_7 = 4.995;
			var expected_8 = 5.005;
			var expected_9 = 0.01;
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.deepEqual(actual_3, expected_3);
			assert.deepEqual(actual_4, expected_4);
			assert.equal(actual_5, expected_5);
			assert.equal(actual_6, expected_6);
			assert.equal(actual_7, expected_7);
			assert.equal(actual_8, expected_8);
			assert.equal(actual_9, expected_9);
		});

		var oil_well_data_discrete_pure = [
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL",
			"OIL"
		];
		it("Single Category Discrete Data", function () {
			var filter_controller = new Oil_well_filter.Oil_well_filter(oil_well_data_discrete_pure, true);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var actual_5 = filter_controller.start;
			var actual_6 = filter_controller.end;
			var expected_1 = "histogram";
			var expected_2 = 1;
			var expected_3 = ["OIL"];
			var expected_4 = [9];
			var expected_5 = 9;
			var expected_6 = 10;
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.deepEqual(actual_3, expected_3);
			assert.deepEqual(actual_4, expected_4);
			assert.equal(actual_5, expected_5);
			assert.equal(actual_6, expected_6);
		});

		var oil_well_data_continuous_pure = [
			5.0,
			5.0,
			5.0,
			5.0,
			5.0,
			5.0,
			5.0,
			5.0,
			5.0
		];
		it("Single Category Continuous Data", function () {
			var filter_controller = new Oil_well_filter.Oil_well_filter(oil_well_data_continuous_pure, false);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var actual_5 = filter_controller.start;
			var actual_6 = filter_controller.end;
			var actual_7 = filter_controller.startpoint;
			var actual_8 = filter_controller.endpoint;
			var actual_9 = filter_controller.category_widths;
			var expected_1 = "histogram";
			var expected_2 = 1;
			var expected_3 = ["[4.995,5.005)"];
			var expected_4 = [9];
			var expected_5 = 9;
			var expected_6 = 10;
			var expected_7 = 4.995;
			var expected_8 = 5.005;
			var expected_9 = 0.01;
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.deepEqual(actual_3, expected_3);
			assert.deepEqual(actual_4, expected_4);
			assert.equal(actual_5, expected_5);
			assert.equal(actual_6, expected_6);
			assert.equal(actual_7, expected_7);
			assert.equal(actual_8, expected_8);
			assert.equal(actual_9, expected_9);
		});

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
		]; //#"OIL" = 15; #"SUSPENDED OIL" = 5; #"ABANDONED OIL" = 1;
		it("Discrete data with a large deviation in counts.", function () {
			var filter_controller = new Oil_well_filter.Oil_well_filter(oil_data_discrete_large_deviation, true);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var expected_1 = "pie-chart"; // For data with large relative differences in frequency, the visualization method will be a pie chart.
			var expected_2 = 3;
			var expected_3 = ["SUSPENDED OIL", "OIL", "ABANDONED OIL"];
			var expected_4 = [5,15,1];
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.deepEqual(actual_3, expected_3);
			assert.deepEqual(actual_4, expected_4);
		});

		var oil_data_discrete_small_deviation = [
			"OIL",
			"OIL",
			"SUSPENDED OIL",
			"SUSPENDED OIL",
			"OIL",
			"OIL",
			"SUSPENDED OIL",
			"SUSPENDED OIL",
			"OIL"
		];
		it("Discrete data with a small deviation in frequencies.", function () {
			var filter_controller = new Oil_well_filter.Oil_well_filter(oil_data_discrete_small_deviation, true);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var actual_5 = filter_controller.start;
			var actual_6 = filter_controller.end;
			var expected_1 = "histogram"; // For data with small relative differences in frequency, the visualization method will be a histogram.
			var expected_2 = 2;
			var expected_3 = ["OIL", "SUSPENDED OIL"];
			var expected_4 = [5, 4];
			var expected_5 = 2;
			var expected_6 = 6;
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.deepEqual(actual_3, expected_3);
			assert.deepEqual(actual_4, expected_4);
			assert.equal(actual_5, expected_5);
			assert.equal(actual_6, expected_6);
		});

		var oil_data_continuous = [
			4.0,
			5.0,
			4.5,
			4.5,
			5.0,
			5.0,
			6.0
		];
		it("Continuous data", function () {
			var filter_controller = new Oil_well_filter.Oil_well_filter(oil_data_continuous, false);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.numofCategories;
			var actual_3 = filter_controller.categories;
			var actual_4 = filter_controller.category_counts;
			var expected_1 = "histogram";
			var expected_2 = 2;
			//assert
			assert.equal(actual_1, expected_1);
		});

		//Test bed:
		/*it("test bed", function () {
			assert.equal(2.5, 5/2);

		});*/
	});

})();
