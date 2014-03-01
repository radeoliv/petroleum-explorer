/*--------------------------------------------------------------------------------
 Author: Shawn Eastwood

 seng515-petroleum-explorer

 =============================================================================
 Filename: visualization_controller.js
 =============================================================================
 Unit tests for visualizations.
 -------------------------------------------------------------------------------*/

require("../../app/scripts/visualization_controller.js", function(Oil_well_filter) {

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

	var oil_data_continuous = [
		11.14489737410,
		9.29390139434,
		12.05953851220,
		11.98196182460,
		12.34077406890,
		5.52895368577,
		10.79587181470,
		14.59685576030,
		24.65277338420,
		9.83221986748,
		14.57744227090,
		15.10417009580,
		8.52390253481,
		19.10239418830,
		9.70031899135,
		9.46446243101,
		22.92059782800,
		10.99377219810,
		16.88100672270,
		35.00513313340,
		28.72197382170,
		25.86087193020,
		26.18537597780,
		32.77070317880,
		19.06683800400,
		17.85751818370,
		13.05981105910,
		24.86748278890,
		20.91777291320,
		13.75900917070,
		15.58365666120,
		9.03302121641,
		12.30564983440,
		20.22363914210,
		9.33303489520,
		6.96009870441,
		17.24449557890,
		13.17887615340,
		14.32951196070,
		11.33641666510,
		18.79651642170,
		18.34416123180,
		20.30920323480,
		13.03023417680,
		4.85058632644
	];

	var valid_visualizations = ["histogram", "pie-chart"]; // This is a list of the possible valid return values of Oil_well_filter.get_visualization_method.
	describe("visualization_controller", function () {
		it("empty data set, discrete data assumed", function () {
			//arrange
			var filter_controller = new Oil_well_filter(oil_data_empty, true);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.start;
			var expected_1 = "histogram"; // The default visualization method.
			var expected_2 = 0.0; // The default starting point.
			//assert
			assert.equal(actual_1, expected_1);
		});

		it("empty data set, continuous data assumed", function () {
			//arrange
			var filter_controller = new Oil_well_filter(oil_data_empty, false);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.start;
			var actual_3 = filter_controller.category_widths;
			var expected_1 = "histogram"; // The default visualization method.
			var expected_2 = 0.0; // The default starting point.
			var expected_3 = 0.0; // The default category width.
			//assert
			assert.equal(actual_1, expected_1);
			assert.equal(actual_2, expected_2);
			assert.equal(actual_3, expected_3);
		});

		it("Discrete data with a large deviation in frequencies.", function () {
			var filter_controller = new Oil_well_filter(oil_data_discrete_large_deviation, true);
			//act
			var actual = filter_controller.get_visualization_method();
			//Test passes if expected is "pie-chart-histogram".
			var expected = "pie-chart";
			//assert
			assert.equal(actual, expected);
		});

		it("Discrete data with a small deviation in frequencies.", function () {
			var filter_controller = new Oil_well_filter(oil_data_discrete_small_deviation, true);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			var actual_2 = filter_controller.start;
			var expected_1 = "histogram"; // For data will small relative differences in frequency, the visualization method will be a histogram.
			//var expected_2 = 0;
			//assert
			assert.equal(actual_1, expected_1);
			//assert.equal(actual_2, expected_2);
		});

		it("Continuous data", function () {
			var filter_controller = new Oil_well_filter(oil_data_continuous, false);
			//act
			var actual_1 = filter_controller.get_visualization_method();
			/*var actual_2 = filter_controller.start;
			var expected_1 = "histogram"; // For data will small relative differences in frequency, the visualization method will be a histogram.
			var expected_2 = 0; //TODO determine a suitable start for the y-axis.
			//assert*/
			//assert.equal(actual_1, expected_1);
			//assert.equal(actual_2, expected_2);
		});

	});

})();

})