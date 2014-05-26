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
	var $visualizationHeader = $("#visualization-header")

	var VisualizationCharts;
	VisualizationCharts = function (MapController){
		this.MapController = MapController;
		self = this;
	};

	VisualizationCharts.prototype.calculateBarChartValues = function(attribute) {
		var currentWells = this.MapController.getCurrentWells();

		if(currentWells != undefined && currentWells != null) {
			var attributeValues = [];
			// Storing all the values of the specified attribute
			for(var i=0; i<currentWells.length; i++) {
				attributeValues.push(currentWells[i][attribute]);
			}
			return attributeValues;
		}
	};

	VisualizationCharts.prototype.generateBarChart = function(attribute, attributeText) {
		// Calculate the data distribution
		var data = this.calculateBarChartValues(attribute);
		var currentWells = this.MapController.getCurrentWells();

		if(data != null && data.length > 0) {

			var width = 800,
				height = 600,
				radius = Math.min(width, height)/1.5;

			var color = d3.scale.category20();

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], 0.1);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				// tickFormat is used to not pollute the chart with a lot of information
				.tickFormat("")
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				//.ticks(10, "%");

			this.removeCurrentChart();
			$('<div id=\"canvas-svg\"</div>').appendTo($visualizationContainer);

			var svg = d3.select("#canvas-svg").append("svg")
				.attr("width", "100%")//width + margin.left + margin.right)
				.attr("height", "98%")//height + margin.top + margin.bottom)
				.attr("viewBox", "0 0 " + (2*radius+width/2) + " " + (2*radius))
				.append("g")
				.attr("width", (width + (width/3)))
				.attr("height", height)
				.attr("transform", "translate(" + (radius*0.2) + "," + (radius*0.4) + ")");

			var drawD3Document = function(data) {
				// Making sure that the value is a double
				data.forEach(function(d) {
					d = +d;
				});

				var count = 0;
				x.domain(data.map(function(d) { return count++; }));//d.letter; }));
				y.domain([0, d3.max(data, function(d) { return d; })]);//d.frequency; })]);

				/*svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height + 1) + ")")
					.call(xAxis);*/

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					//.attr("dy", "-4em")
					.style({
						"text-anchor": "end",
						"font-size": "1.1em"
					})
					.text(attributeText);

				var applyAllTextLegend = function(barId) {
					// We have to append multiple SVGs since we can't use line break to do it
					var index = 0;
					applyTextLegend(barId, index++);
					applyTextLegend(barId, index++);

					var temp = index++;
					svg.append("line")
						.attr("id", "line-separator")
						.attr("x1", width)
						.attr("x2", (width + width/2.8))
						// y function is pretty much the same as the text in applyTextLegend function
						.attr("y1", (20 + (17 * temp)))
						.attr("y2", (20 + (17 * temp)))
						// The style is pretty much the same as the rectangle for the legends
						.style({
							"stroke": "black",
							"stroke-width": "0.05em"
						});

					// UWI
					applyTextLegend(barId, index++);
					applyTextLegend(barId, index++);

					// Company name
					index++;
					applyTextLegend(barId, index++);
					applyTextLegend(barId, index++);

					// Status
					index++;
					applyTextLegend(barId, index++);
					applyTextLegend(barId, index++);
				};

				var applyTextLegend = function(barId, index) {
					var getTextToAppend = function(barId, index) {
						// The indices of the two values of the legend have to be x % 3 == 0 and x % 3 == 1
						// This produces the line break
						switch(index) {
							case 0:
								return attributeText;
							case 1:
								return currentWells[barId][attribute];

							case 3:
								return "UWI";
							case 4:
								return currentWells[barId]["Well_Unique_Identifier"];

							case 6:
								return "Well Operator"
							case 7:
								return currentWells[barId]["Well_Operator"];

							case 9:
								return "Well Status";
							case 10:
								return currentWells[barId]["Well_Status"];

							default:
								return "";
						}
					};

					svg.append("text")
						.attr("id", "text-info"+index)
						.attr("class", "text-info")
						.attr("x", (width + 10))
						.attr("y", function(d) {
							// Used to create spaces between the elements
							return 20 + (20*index);
						})
						.style({
							"font-size": function() { return index%3 === 0 ? "0.9em" : "0.8em" },
							"font-weight": function() { return index%3 === 0 ? "bold" : "normal" }
						})
						.text(getTextToAppend(barId, index));
				};

				count = 0;
				var count2 = 0;
				var fixLegendContent = false;
				svg.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("id", function(d) { return "bar-" + (count++); })
					.attr("x", function(d) { return x(count2++); })
					.attr("y", function(d) { return y(d); })
					.attr("width", x.rangeBand())
					.on("mouseover", function() {
						if(fixLegendContent === false) {
							// Getting the bar id
							var barId = $(this)[0].id;
							// Highlight the bar
							d3.select("#"+barId).style("fill", "darkorange");
							// Removing all the characters that are not digits
							barId = barId.replace(/^\D*/g, '');
							// Inserting all legends
							applyAllTextLegend(barId);
						}
					})
					.on("mouseout", function() {
						if(fixLegendContent === false) {
							// Setting the normal color
							d3.select("#" + $(this)[0].id).style("fill", "steelblue");
							// Removing all text information
							d3.selectAll(".text-info").remove();
							d3.selectAll("#line-separator").remove();
						}
					})
					.on("click", function() {
						// The click event fix the information in the rectangle (legends)
						fixLegendContent = !fixLegendContent;
						if(fixLegendContent === false) {
							d3.selectAll(".bar").style("fill", "steelblue");
							d3.selectAll(".text-info").remove();
							d3.selectAll("#line-separator").remove();
						} else {
							// Highlight the bar with another color
							d3.select("#"+$(this)[0].id).style("fill", "orangered");
						}
					})
					.transition().delay(function (d,i){ return i * 15;}).duration(200)
					.attr("height", function(d) { return height - y(d); })
					.style("fill", "steelblue");

				var rect = svg.append("rect")
					.attr("x", width)
					.attr("y", 0)
					.attr("width", (width / 2.8))
					.attr("height", (height/2.5))
					.style({
						//"fill": "rgb(220,220,220)",
						"fill": "none",
						"stroke": "black",
						"stroke-width": "0.05em"
					});
			}
			drawD3Document(data);
		}
	};

	VisualizationCharts.prototype.calculatePieChartValues = function(attribute) {
		var currentWells = this.MapController.getCurrentWells();

		if(currentWells != undefined && currentWells != null) {
			var attributeValues = [];
			// Storing all the values of the specified attribute
			for(var i=0; i<currentWells.length; i++) {
				attributeValues.push(currentWells[i][attribute]);
			}

			// Calculating the amount of each value in the list
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
			$('<div id=\"canvas-svg\"</div>').appendTo($visualizationContainer);

			var svg = d3.select("#canvas-svg").append("svg")
				.attr("width", "100%")
				.attr("height", "98%")
				.attr("viewBox", "0 0 " + (2*radius+width/2) + " " + (2*radius+width/20))
				.append("g")
				.attr("transform", "translate(" + (radius) + "," + (radius + radius/6) + ")");

			var drawD3Document = function(data) {
				// Making sure that the value is a double
				data.forEach(function(d) {
					d[DATA] = +d[DATA];
				});

				var g = svg.selectAll(".arc")
					.data(pie(data))
					.enter().append("g")
					.attr("class", "arc")
					.on("mouseover", function() {
						var arcId = $(this)[0].children[0].id;
						arcId = arcId.replace(/^\D*/g, '');

						d3.selectAll(".legend")
							.style("opacity", 0.2);

						var legend = d3.select("#legend-" + arcId);
						legend.style("opacity", "1.0");
					})
					.on("mouseout", function() {
						d3.selectAll(".legend")
							.style("opacity", 1.0);
					});

				var count = 0;
				var legend = svg.selectAll(".legend")
					.data(data).enter()
					.append("g").attr("class", "legend")
					.attr("id", function(d) { return "legend-" + (count++); })
					.attr("transform", function(d, i) {
						return "translate(-60," + (-70 + i * 20) + ")";
					})
					.on("mouseover", function() {
						var legendId = $(this).attr("id");
						legendId = legendId.replace(/^\D*/g, '');
						var arc = d3.select("#arc-" + legendId);
						var allArcs = d3.selectAll("path")
							.style({
								"opacity": function(d) { return (this === arc[0][0]) ? 1.0 : 0.2; },
								"stroke-width": function(d) { return (this === arc[0][0]) ? "0.1em" : "0.02em" }
							});
					})
					.on("mouseout", function() {
						var arc = d3.selectAll("path")
							.style("opacity", 1)
							.style("stroke-width", "0.02em");
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
					.style({
						"fill": function(d,i) { return color(i); },
						"stroke": "black",
						"stroke-width": "0.02em"
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