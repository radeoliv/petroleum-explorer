/*--------------------------------------------------------------------------------
 Author: Shawn Eastwood


 seng515-petroleum-explorer

 =============================================================================
 Filename: visualization_controller.js
 =============================================================================
 Implementation of Oil_well_filter
 -------------------------------------------------------------------------------*/


//TODO: Implement oil_well_filter class.
function Oil_well_filter(oil_data, discrete_flag) {
	this.oil_data = oil_data; //oil_data is an array that stores the data that needs to be visualized.
	this.discrete_flag = discrete_flag; //discrete_flag is a boolean variable that is true if the data consists of discrete quantities and is false if otherwise.

	this.categories = []; //An array that holds the categories of the histogram/pie-chart.
	this.frequency_counts = []; //An array that holds the corresponding frequency for each category.

	this.visualization_method = ""; //visualization method is a string from {"histogram", "pie-chart"} that denotes the method of visualization that is to be used.
	this.start = 0; //For bar histograms, start will indicate the beginning point of the vertical axis. This will better emphasize absolute differences in quantity.
	this.category_widths = 0.0; //For continuous data, category_widths denotes the width of each interval within which all quantities are given the same classification.

};

Oil_well_filter.prototype.get_visualization_method = function () {
	this.visualization_method = "histogram";

	return this.visualization_method;
};

(typeof exports !== "undefined" && exports !== null ? exports : window).Oil_well_filter = Oil_well_filter;
// Export to the global scope.
/*(typeof exports !== "undefined" && exports !== null ? exports : window).Oil_well_filter = Oil_well_filter;
//class = {}
exports.myVar = true;*/