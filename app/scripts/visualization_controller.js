/*--------------------------------------------------------------------------------
 Author: Shawn Eastwood


 seng515-petroleum-explorer

 =============================================================================
 Filename: visualization_controller.js
 =============================================================================
 Implementation of Oil_well_filter
 -------------------------------------------------------------------------------*/

(function () {
	var Oil_well_filter;

	Oil_well_filter = (function () {

		function Oil_well_filter(oil_data, discrete_flag) {
			this.oil_data = oil_data; //oil_data is an array that stores the data that needs to be visualized.
			this.discrete_flag = discrete_flag; //discrete_flag is a boolean variable that is true if the data consists of discrete quantities and is false if otherwise.

			this.categories = []; //An array that holds the categories of the histogram/pie-chart.
			this.category_counts = []; //An array that holds the number of occurrences of each category.

			this.visualization_method = ""; //visualization method is a string from {"histogram", "pie-chart"} that denotes the method of visualization that is to be used.
			this.start = 0; //For bar histograms, start will indicate the beginning point of the vertical axis. This will better emphasize absolute differences in quantity.
			this.category_widths = 0.0; //For continuous data, category_widths denotes the width of each interval within which all quantities are given the same classification.

		};

		Oil_well_filter.prototype.get_visualization_method = function () {
			this.categories = [];
			this.category_counts = [];

			if (this.discrete_flag) {
				//If the data is discrete, determine the categories and frequencies.
				var N = this.oil_data.length;
				for (var i = 0;
					i < N;
					i++) {
					//Determine if element already exists in "categories".
					var category_index = -1;
					var j = 0;
					while (category_index == -1 && j < this.categories.length) {
						if (this.oil_data[i] == this.categories[j]) {
							category_index = j;
						}
						j++;
					}
					if (category_index != -1) {
						//If the category is found, increment the count.
						this.category_counts[category_index]++;
					}
					else {
						//Else add a new category.
						this.categories.push(this.oil_data[i]);
						this.category_counts.push(1);
					}
				}
				//Find the maximum and minimum counts. If the data set is empty, these quantities default to 0.
				var max_count = 0;
				var min_count = 0;
				if (this.category_counts.length > 0) {
					max_count = this.category_counts[0];
					min_count = this.category_counts[0];
					for (var i = 1;
						i < this.category_counts.length;
						i++) {
						if (this.category_counts[i] > max_count) {
							max_count = this.category_counts[i];
						}
						if (this.category_counts[i] < min_count) {
							min_count = this.category_counts[i];
						}
					}
				}
				var threshold = 1.0 //The the threshold of (max_count-min_count)/min_count above which the pie-chart will be used. Large values of (max_count-min_count)/min_count indicate great relative differences between the counts which the pie-chart a good choice.
				if ((max_count - min_count) / min_count >= threshold) {
					//Use the pie-chart
					this.visualization_method = "pie-chart";
					return this.visualization_method;
				}
				else {
					//Use the histogram
					this.visualization_method = "histogram";
					//Find a useful starting point

				}
			}
			else {
				//If the data is continuous:
			}

			this.visualization_method = "histogram";

			return this.visualization_method;
		};

		return Oil_well_filter;

	})();

	(typeof exports !== "undefined" && exports !== null ? exports : window).Oil_well_filter = Oil_well_filter;
// Export to the global scope.
	/*(typeof exports !== "undefined" && exports !== null ? exports : window).Oil_well_filter = Oil_well_filter;
	 //class = {}
	 exports.myVar = true;*/
}).call(this);