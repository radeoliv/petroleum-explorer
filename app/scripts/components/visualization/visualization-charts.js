/*--------------------------------------------------------------------------------
	Author: Rodrigo Silva

	petroleum-explorer

	=============================================================================
	Filename: visualization-charts.js
	=============================================================================
	This file contains the functions to generate the different types of charts
	with D3.
-------------------------------------------------------------------------------*/

(function () {

	var self;
	var $visualizationContainer = $("#visualization-container");

	var VisualizationCharts;
	VisualizationCharts = function (MapController){
		this.MapController = MapController;
		self = this;
	};

	VisualizationCharts.prototype.calculatePieChartValues = function(attribute) {
		var currentWells = this.MapController.getCurrentWells();

		if(currentWells != undefined && currentWells != null) {
			var attributeValues = [];
			// Storing all the values of the specified attribute
			for(var i=0; i<currentWells.length; i++) {
				attributeValues.push(currentWells[i][attribute]);
			}

			// Calculating the percentage of each value in the list
			attributeValues.sort();

			var result = [];
			var valueFound = -1;
			for(var i=0; i<attributeValues.length; i++) {
				valueFound = -1;
				for(var j=0; j<result.length; j++) {
					if(result.length === 0) {
						break;
					}
					if(attributeValues[i] === result[j][0]) {
						valueFound = j;
						break;
					}
				}
				if(valueFound >= 0) {
					result[valueFound][1]++;
				} else {
					result.push([attributeValues[i], 1]);
				}
			}

			return result;
		}
	};

	VisualizationCharts.prototype.generatePieChart = function(attribute) {

		// Calculate the data distribution
		var data = this.calculatePieChartValues(attribute);

		if(data != null && data.length > 0) {
			var NAME = 0;
			var DATA = 1;

			var biggestNameLength = -1;
			var totalEntries = 0;
			for(var i=0; i<data.length; i++) {
				if(data[i][NAME].length > biggestNameLength) {
					biggestNameLength = data[i][NAME].length;
				}
				totalEntries += data[i][DATA];
			}

			var width = 800,
				height = 600,
				radius = Math.min(width, height) / 2.5;

			var color = d3.scale.category20();

			var arc = d3.svg.arc()
				.outerRadius(radius - 10)
				.innerRadius(0);

			var pie = d3.layout.pie()
				.sort(null)
				.startAngle(1.1 * Math.PI)
				.endAngle(3.1 * Math.PI)
				.value(function(d) { return d[DATA]; });

			this.removeCurrentChart();
			var svgContainer = $('<div id=\"canvas-svg\"</div>').appendTo($visualizationContainer);

			var container = $("#canvas-svg");

			var svg = d3.select("#canvas-svg").append("svg")
				.attr("width", "100%")
				.attr("height", "98%")
				.attr("viewBox", "0 0 " + (2*radius+width/2) + " " + 2*radius)
				.append("g")
				.attr("transform", "translate(" + (radius) + "," + (radius + radius/6) + ")");

			var drawD3Document = function(data) {
				data.forEach(function(d,i) {
					d[DATA] = +d[DATA];
				});

				var g = svg.selectAll(".arc")
					.data(pie(data))
					.enter().append("g")
					.attr("class", "arc");

				var count = 0;
				var legend = svg.selectAll(".legend")
					.data(data).enter()
					.append("g").attr("class", "legend")
					.attr("legend-id", function(d) {
						return count++;
					})
					.attr("transform", function(d, i) {
						return "translate(-60," + (-70 + i * 20) + ")";
					})
					.on("click", function() {
						//console.log("#arc-" + $(this).attr("legend-id"));
						var arc = d3.select("#arc-" + $(this).attr("legend-id"));
						arc.style("opacity", 0.7);
						arc.style("fill", "black");
						var ref = $(this);
						setTimeout(function() {
							arc.style("opacity", 1);
							arc.style("fill", color(ref.attr("legend-id")));
						}, 500);
					});

				var legendOffset = biggestNameLength * 7;
				// Creating the colored rectangles
				legend.append("rect")
					.attr("x", (width / 2) + legendOffset)
					.attr("y", function(d,i) {
						// Used to create spaces between the elements
						return 20*(i-10);
					})
					.attr("width", 18).attr("height", 18)
					.style("fill", function(d,i) {
						return color(i);
					});

				// Creating the legend for each rectangle
				legend.append("text").attr("x", (width / 2 - 5) + legendOffset)
					.attr("y", function(d,i) {
						// Used to create spaces between the elements
						return 20*(i-10) + 9;
					})
					.attr("dy", ".35em")
					.style({
						"text-anchor": "end",
						"font-size": "0.9em"
					})
					.text(function(d,i) {
						return d[NAME];
					});

				// Creating the percentage value underneath each legend
				legend.append("text").attr("x", (width / 2 - 5) + legendOffset)
					.attr("y", function(d,i) {
						// Used to create spaces between the elements
						return 20*(i-10) + 9 + 16;
					})
					.attr("dy", ".35em")
					.style({
						"text-anchor": "end",
						"font-size": "0.7em"
					})
					.text(function(d) {
						var percentage = Number(d[DATA] * 100 / totalEntries).toFixed(2) + "%";
						var numberOfWells = "(" + d[DATA] + " well";
						numberOfWells += d[DATA] === 1 ? ")" : "s)";

						return percentage + " " + numberOfWells;
					});

				count = 0;
				g.append("path")
					.attr("d", arc)
					.attr("id", function(d) { return "arc-" + (count++); })
					.style("opacity", 0)
					.transition().delay(function(d, i) { return i * 400; }).duration(400)
					.attrTween('d', function(d) {
						var i = d3.interpolate(d.startAngle, d.endAngle);
						return function(t) {
							d.endAngle = i(t);
							return arc(d);
						}
					})
					.style({
						"fill": function(d,i) { return color(i); },
						"opacity": function(d) { return 1; }
					});
			};
			drawD3Document(data);
		}
	};

	VisualizationCharts.prototype.removeCurrentChart = function() {
		$("#canvas-svg").remove();
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).VisualizationCharts = VisualizationCharts;
}).call(this);