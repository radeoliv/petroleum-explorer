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

	var VisualizationCharts;
	VisualizationCharts = function (MapController){
		this.MapController = MapController;
		self = this;
	};

	VisualizationCharts.prototype.generatePieChart = function() {
		var WIDTH = 600, HEIGHT = 450;

		// Testing! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		var data = [
			{
				"age": "<5",
				"population": "2704659"
			},
			{
				"age": "5-13",
				"population": "4499890"
			},
			{
				"age": "14-17",
				"population": "2159981"
			},
			{
				"age": "18-24",
				"population": "3853788"
			},
			{
				"age": "25-44",
				"population": "14106543"
			},
			{
				"age": "45-64",
				"population": "8819342"
			},
			{
				"age": "≥65",
				"population": "612463"
			}
		];
		// Testing! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

		var SEGMENT = "age";
		var DATA = "population";

		var width = WIDTH,
			height = HEIGHT,
			radius = Math.min(width, height) / 3;

		var COLOR_1 = "#7ede8d";
		var COLOR_2 = "#8a89a6";
		var COLOR_3 = "#7b6888";
		var COLOR_4 = "#6b486b";
		var COLOR_5 = "#a05d56";
		var COLOR_6 = "#d0743c";
		var COLOR_7 = "#ff8c00";

		var color = d3.scale.ordinal()
			.range([COLOR_1, COLOR_2, COLOR_3,
				COLOR_4, COLOR_5, COLOR_6, COLOR_7]);

		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d[DATA]; });

		var svg = d3.select("#canvas-svg").append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");

		var drawD3Document = function(data) {
			data.forEach(function(d) {
				d[DATA] = +d[DATA];
			});
			var g = svg.selectAll(".arc")
				.data(pie(data))
				.enter().append("g")
				.attr("class", "arc");

			var count = 0;

			g.append("path")
				.attr("d", arc)
				.attr("id", function(d) { return "arc-" + (count++); })
				.style("fill", function(d) {
					return color(d.data[SEGMENT]);
				});
			g.append("text").attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			}).attr("dy", ".35em").style("text-anchor", "middle")
				.text(function(d) {
					return d.data[SEGMENT];
				});

			count = 0;
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
					console.log("#arc-" + $(this).attr("legend-id"));
					var arc = d3.select("#arc-" + $(this).attr("legend-id"));
					arc.style("opacity", 0.3);
					setTimeout(function() {
						arc.style("opacity", 1);
					}, 1000);
				});

			legend.append("rect")
				.attr("x", width / 2)
				.attr("width", 18).attr("height", 18)
				.style("fill", function(d) {
					return color(d[SEGMENT]);
				});
			legend.append("text").attr("x", width / 2)
				.attr("y", 9).attr("dy", ".35em")
				.style("text-anchor", "end").text(function(d) {
					return d[SEGMENT];
				});
		};
		drawD3Document(data);
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).VisualizationCharts = VisualizationCharts;
}).call(this);