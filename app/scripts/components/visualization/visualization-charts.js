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
		/*
		 * highlightedMarkers contains all the highlighted markers on the map
		 * For each element, index 0 = UWI, index 1 = index in the array of all wells being displayed
		 */
		var highlightedMarkers = this.MapController.getHighlightedMarkers();
		var highlightedIndices = [];
		if(highlightedMarkers != undefined && highlightedMarkers != null) {
			for(var i=0; i<highlightedMarkers.length; i++) {
				highlightedIndices[highlightedMarkers[i][1]] = 1;
			}
		}

		function getRightBarFillColor(index) {
			if(highlightedIndices[index] != undefined && highlightedIndices[index] === 1) {
				return "#8563F2";
			} else {
				return "steelblue";
			}
		}

		if(data != null && data.length > 0) {

			var width = 800,
				height = 600,
				radius = Math.min(width, height)/1.5;

			var x = d3.scale.ordinal()
				.rangeBands([34, width-34], 0.1);

			var y = d3.scale.linear()
				.range([height, 0]);

			/*
			var xAxis = d3.svg.axis()
				.scale(x)
				// tickFormat is used to not pollute the chart with a lot of information
				.tickFormat("")
				.orient("bottom");
			*/

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				//.ticks(10, "%");

			this.removeCurrentChart();
			$('<div id=\"canvas-svg\"></div>').appendTo($visualizationContainer);

			var svg = d3.select("#canvas-svg").append("svg")
				.attr("width", "100%")//width + margin.left + margin.right)
				.attr("height", "100%")//height + margin.top + margin.bottom)
				.attr("viewBox", "0 0 " + (2*radius+width/2) + " " + (2*radius))
				.append("g")
				.attr("width", (width + (width/3)))
				.attr("height", height)
				.attr("transform", "translate(" + (radius*0.2) + "," + (radius*0.4) + ")");

			var drawD3Document = function(data) {
				// Making sure that the value is a double
				for(var i=0; i<data.length; i++) {
					data[i] = +data[i];
				}

				var count = 0;
				x.domain(data.map(function(d) { return count++; }));
				y.domain([0, d3.max(data, function(d) { return d; })]);

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
								return currentWells[barId]["w_uwi"];

							case 6:
								return "Well Operator";
							case 7:
								return currentWells[barId]["w_operator"];

							case 9:
								return "Well Status";
							case 10:
								return currentWells[barId]["w_current_status"];

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
					.enter()
					.append("rect")
					.attr("class", "bar")
					.attr("id", function() { return "bar-" + (count++); })
					.attr("x", function() { return x(count2++); })
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
							// Making the legend rectangle visible
							d3.select("#legend-rectangle").style("opacity", 1.0);
						}
					})
					.on("mouseout", function() {
						if(fixLegendContent === false) {
							// Setting the normal color
							d3.select("#" + $(this)[0].id).style("fill", function() {
								return getRightBarFillColor($(this)[0].id.replace(/^\D*/g, ''));
							});
							// Removing all text information
							d3.selectAll(".text-info").remove();
							d3.selectAll("#line-separator").remove();
							// Making the legend rectangle invisible
							d3.select("#legend-rectangle").style("opacity", 0.0);
						}
					})
					.on("click", function() {
						// The click event fix the information in the rectangle (legends)
						fixLegendContent = !fixLegendContent;
						if(fixLegendContent === false) {
							d3.selectAll(".bar").style("fill", function(d,i) {
								return getRightBarFillColor(i);
							});
							d3.selectAll(".text-info").remove();
							d3.selectAll("#line-separator").remove();
							// Making the legend rectangle invisible
							d3.select("#legend-rectangle").style("opacity", 0.0);
						} else {
							// Highlight the bar with another color
							d3.select("#"+$(this)[0].id).style("fill", "orangered");
						}
					})
					.attr("height", 0)
					.attr("y", height)
					.transition().duration(1600).ease("elastic-in")
					.attr("y", function(d) { return y(d); })
					.attr("height", function(d) { return height - y(d); })
					.style("fill", function(d,i) {
						return getRightBarFillColor(i);
					});

				var rect = svg.append("rect")
					.attr("id", "legend-rectangle")
					.attr("x", width)
					.attr("y", 0)
					.attr("width", (width / 2.8))
					.attr("height", (height / 2.5))
					.style({
						"fill": "none",
						"stroke": "black",
						"stroke-width": "0.05em",
						"opacity": 0
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
			$('<div id=\"canvas-svg\"></div>').appendTo($visualizationContainer);

			var svg = d3.select("#canvas-svg").append("svg")
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("viewBox", "0 0 " + (2*radius+width/2) + " " + (2*radius+width/20))
				.append("g")
				.attr("transform", "translate(" + (radius) + "," + (radius + radius/6) + ")");

			var drawD3Document = function(data) {
				// Making sure that the value is a double
				for(var i=0; i<data.length; i++) {
					data[i][DATA] = +data[i][DATA];
				}

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

						// All arcs
						d3.selectAll("path")
							.style({
								"opacity": function(d) { return (this === arc[0][0]) ? 1.0 : 0.2; },
								"stroke-width": function(d) { return (this === arc[0][0]) ? "0.1em" : "0.02em" }
							});
					})
					.on("mouseout", function() {
						d3.selectAll("path")
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
					.text(function(d) {
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

				// Three seconds to load the entire chart
				var baseLoadingTime = 1000;
				var lastLoadTime = 0;

				count = 0;
				g.append("path")
					.attr("d", arc)
					.attr("id", function(d) { return "arc-" + (count++); })
					.style("opacity", 0)
					.transition()
					.delay(function(d, i) {
						var delayTime = Math.log(1.3 + (d["value"] / totalEntries)) * baseLoadingTime;

						if(i === 0) {
							lastLoadTime += delayTime;
							return 0;
						} else {
							lastLoadTime += delayTime;
						}

						return lastLoadTime - delayTime;
					})
					.duration(function(d, i) {
						return Math.log(1.3 + (d["value"] / totalEntries)) * baseLoadingTime;
					})
					.ease("sin-out")
					.style({
						"fill": function(d,i) { return color(i); },
						"opacity": function(d) { return 1; }
					})
					.attrTween('d', function(d) {
						var i = d3.interpolate(d.startAngle, d.endAngle);
						return function(t) {
							d.endAngle = i(t);
							return arc(d);
						}
					});
			};
			drawD3Document(data);
		}
	};

	VisualizationCharts.prototype.getStatusInfoFromWell = function(uwi) {
		var encodedUWI = encodeURIComponent(uwi.toUpperCase().trim());
		var statusInfo = [];
		$.ajax({
			url: 'http://localhost:3000/getStatusInfoFromWell/' + encodedUWI,
			dataType:'json',
			async: false,
			success: function(data){
				statusInfo = data;
			}
		});

		if(statusInfo != null && statusInfo.length > 0) {
			// Ignore the time of the s_date (hours, minutes, seconds)
			for(var i=0; i<statusInfo.length; i++) {
				statusInfo[i]["s_date"] = statusInfo[i]["s_date"].substr(0,10);
			}
		}

		return statusInfo;
	};

	VisualizationCharts.prototype.generateTimelineChart = function(statusInfo, removeCurrentChart) {
		if(removeCurrentChart === true) {
			this.removeCurrentChart();
		}
		if($("#canvas-svg").length === 0) {
			$('<div id=\"canvas-svg\"></div>').appendTo($visualizationContainer);
		}

		var start;
		var end = new Date();
		var data = [];
		for(var i=0; i<statusInfo.length; i++) {
			var auxStartDate = statusInfo[i]["s_date"].split("-");
			var startDate = new Date(auxStartDate[0], auxStartDate[1], auxStartDate[2], 0,0,0,0);

			if(i === 0) {
				start = startDate;
			}

			var auxEndDate;
			var endDate;
			if(i < statusInfo.length - 1) {
				auxEndDate = statusInfo[i+1]["s_date"].split("-");
				endDate = new Date(auxEndDate[0], auxEndDate[1], auxEndDate[2], 0,0,0,0);
			} else {
				endDate = end;
			}

			var times = {"starting_time": startDate, "ending_time": endDate};
			var res = false;
			/* Checking if the current label already exists.
			 * In positive case, only the starting and end time are added.
			 * In negative case, a new entry is pushed to the data array.
			 */
			for(var j=0; j<data.length; i++) {
				if(data[j]["status"] === statusInfo[i]["s_status"]) {
					data[j]["times"].push(times);
					res = true;
					return;
				}
			}

			if(res === false) {
				var tempData = { status:statusInfo[i]["s_status"], times: [times] };
				data.push(tempData);
			}
		}

		// Getting all the different statuses present in the database
		var statusCategory = [];
		$.ajax({
			url: 'http://localhost:3000/getAllDistinctStatuses/',
			dataType:'json',
			async: false,
			success: function(statuses){
				for(var i=0; i<statuses.length; i++) {
					statusCategory.push(statuses[i]["s_status"]);
				}
			}
		});

		// Reordering the statusCategory in order to have the status of data as first elements
		for(var i=data.length-1; i >= 0; i--) {
			statusCategory.splice($.inArray(data[i]["status"], statusCategory),1);
			statusCategory.splice(0,0,data[i]["status"]);
			statusCategory.join();

			// Adjusting the labels of the data (first letter capital and the rest lower case)
			data[i]["status"] = data[i]["status"][0] + data[i]["status"].substr(1).toLowerCase();
		}

		// Adjusting the strings of the statusCategory (first letter capital and the rest lower case)
		for(var i=0; i<statusCategory.length; i++) {
			statusCategory[i] = statusCategory[i][0] + statusCategory[i].substr(1).toLowerCase();
		}

		var width = 900;
		var height = 400;
		var itemHeight = 20;
		var itemMargin = 5;
		var marginTop = height / 4;
		var legendX = width - width/4;
		var legendY = -height/8;

		var chart = d3.timeline()
			.width(width)
			.margin({left:55,right:60,top:marginTop,bottom:0})
			.itemMargin(itemMargin)
			.itemHeight(itemHeight)
			.tickFormat({
				format: d3.time.format("%b %Y"),
				tickTime: getTickTime(),
				tickInterval: getTickInterval(),
				tickSize: 10
			})
			.rotateTicks(30)
			.mouseover(function(d, i, datum) {
				// Lowering the opacity of all legends
				d3.selectAll(".legend")
					.style("opacity", 0.2);

				// And increasing the opacity of the status being hovered
				var legendId = "#" + getLegendId(datum["status"]);
				var legend = d3.select(legendId);
				legend.style("opacity", function() {
					return 1.0;
				});

				var count = 0;
				// First date text
				insertHoverInformation(d, count++);
				// First date value
				insertHoverInformation(d, count++);
				// Space
				count++;
				// Last date text
				insertHoverInformation(d, count++);
				// Last date value
				insertHoverInformation(d, count++);

				// Making the information rectangle visible
				d3.select("#legend-rectangle")
					.style("opacity", 1.0);
			})
			.mouseout(function() {
				// Removing all text information
				d3.selectAll(".text-info").remove();
				// Making the information rectangle invisible
				d3.select("#legend-rectangle")
					.style("opacity", 0.0);
				// Increasing the opacity of all legends
				d3.selectAll(".legend")
					.style("opacity", 1.0);
			});

		function insertHoverInformation(d,index) {
			function getTextToAppend(d, index) {
				switch(index) {
					case 0:
						return "First date";
					case 1:
						return d.starting_time.toDateString();
					case 3:
						return "Last date";
						break;
					case 4:
						return d.ending_time.toDateString();
				}
			}

			svg.append("text")
				.attr("id", "text-info"+index)
				.attr("class", "text-info")
				.attr("x", (legendX + 17))
				.attr("y", function() {
					// Used to create spaces between the elements
					return legendY + 20 + (15*index);
				})
				.style({
					"font-size": function() { return index%3 === 0 ? "0.8em" : "0.7em"; },
					"font-weight": function() { return index%3 === 0 ? "bold" : "normal"; }
				})
				.text(getTextToAppend(d,index));
		}

		function getLegendId(status) {
			var legend = status.replace("&",'and');
			legend = legend.replace(/ /g,'-').toLowerCase();

			return "legend-" + legend;
		}

		function getTickTime() {
			var diff = end.getFullYear() - start.getFullYear();
			if(diff > 10) {
				return d3.time.year;
			} else {
				return d3.time.month;
			}
		}

		function getTickInterval() {
			var diff = end.getFullYear() - start.getFullYear();
			if(diff <= 5) {
				return 3;
			} else if(diff <= 10) {
				return 7;
			} else {
				return 1;
			}
		}

		var svg = d3.select("#canvas-svg").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 -150 " + (width) + " " + (height))
			.datum(data).call(chart);

		// Loading default colors of D3
		var color = d3.scale.category20();

		var legend = svg.append("g")
			.attr("class","legends")
			.attr("x", 60)
			.attr("y", -60)
			.attr("height", 100)
			.attr("width", 100);

		legend.selectAll('g')
			.data(statusCategory)
			.enter()
			.append('g')
			.each(function(d,i) {
				var g = d3.select(this);
				g.attr("id", getLegendId(statusCategory[i]));
				g.attr("class","legend");

				g.append("svg:rect")
					.style({
						"fill":"grey",
						"opacity":0.1,
						"stroke": "black",
						"stroke-width": "0.05em"
					})
					.attr("x", 55)
					.attr("y", -marginTop/1.5 + i*17)
					.attr("height", 13)
					.attr("width", 0)
					.transition()
					.duration(800)
					.attr("width", 35)
					.style({
						"fill":function() {
							if(i < data.length) {
								return color(i);
							} else {
								return "grey";
							}
						},
						"opacity": function() {
							if(i < data.length) {
								return 1.0;
							} else {
								return 0.3;
							}
						}
					});

				g.append("svg:text")
					.style({ "opacity": 0 })
					.text(statusCategory[i])
					.transition()
					.delay(400)
					.duration(700)
					.attr("x", 95)
					.attr("y", -marginTop/1.5 + 11.2 + i*17)
					.attr("font-size","0.85em")
					.style({
						"opacity":function() {
							if(i < data.length) {
								return 1.0;
							} else {
								return 0.3;
							}
						}
					});
			});

		var rect = svg.append("rect")
			.attr("id", "legend-rectangle")
			.attr("x", legendX+5)
			.attr("y", legendY)
			.attr("width", (width / 6))
			.attr("height", (height / 4.4))
			.style({
				"fill": "none",
				"stroke": "black",
				"stroke-width": "0.05em",
				"opacity": 0
			});
	}

	VisualizationCharts.prototype.getInfoFromWell = function(uwi) {
		var encodedUWI = encodeURIComponent(uwi.toUpperCase().trim());
		var wellInfo = [];
		$.ajax({
			url: 'http://localhost:3000/getInfoFromWell/' + encodedUWI,
			dataType:'json',
			async: false,
			success: function(data){
				wellInfo = data;
			}
		});

		return wellInfo;
	};

	VisualizationCharts.prototype.getInjectionInfoFromWell = function(uwi) {
		var encodedUWI = encodeURIComponent(uwi.toUpperCase().trim());
		var injectionInfo = [];
		$.ajax({
			url: 'http://localhost:3000/getInjectionInfoFromWell/' + encodedUWI,
			dataType:'json',
			async: false,
			success: function(data){
				injectionInfo = data;
			}
		});

		return injectionInfo;
	};

	VisualizationCharts.prototype.getProductionInfoFromWell = function(uwi) {
		var encodedUWI = encodeURIComponent(uwi.toUpperCase().trim());
		var productionInfo = [];
		$.ajax({
			url: 'http://localhost:3000/getProductionInfoFromWell/' + encodedUWI,
			dataType:'json',
			async: false,
			success: function(data){
				productionInfo = data;
			}
		});

		return productionInfo;
	};

	VisualizationCharts.prototype.generateInjectionProductionChart = function(injectionProductionInfo, type) {

		this.removeCurrentChart();
		var canvasSvg =
			"<div id=\"canvas-svg\">" +
			"	<table id=\"side_panel_table\">" +
			"		<tr>" +
			"			<td>" +
			"				<form id=\"side_panel\">" +
			"					<section><div id=\"legend\"></div></section>" +
			"					<section>" +
			"						<div id=\"renderer_form\" class=\"toggler\">" +
			"							<input type=\"radio\" name=\"renderer\" id=\"area\" value=\"area\">" +
			"							<label for=\"area\">area</label>" +
			"							<input type=\"radio\" name=\"renderer\" id=\"bar\" value=\"bar\">" +
			"							<label for=\"bar\">bar</label>" +
			"							<input type=\"radio\" name=\"renderer\" id=\"line\" value=\"line\" checked>" +
			"							<label for=\"line\">line</label>" +
			"							<input type=\"radio\" name=\"renderer\" id=\"scatter\" value=\"scatterplot\">" +
			"							<label for=\"scatter\">scatter</label>" +
			"						</div>" +
			"					</section>" +
			"					<section>" +
			"						<div id=\"offset_form\">" +
			"							<label for=\"stack\" class=\"disabled\">" +
			"								<input type=\"radio\" name=\"offset\" id=\"stack\" value=\"zero\" disabled>" +
			"								<span>stack</span>" +
			"							</label>" +
			"							<label for=\"stream\" class=\"disabled\">" +
			"								<input type=\"radio\" name=\"offset\" id=\"stream\" value=\"wiggle\" disabled>" +
			"								<span>stream</span>" +
			"							</label>" +
			"							<label for=\"pct\">" +
			"								<input type=\"radio\" name=\"offset\" id=\"pct\" value=\"expand\">" +
			"								<span>pct</span>" +
			"							</label>" +
			"							<label for=\"value\">" +
			"								<input type=\"radio\" name=\"offset\" id=\"value\" value=\"value\" checked>" +
			"								<span>value</span>" +
			"							</label>" +
			"						</div>" +
			"						<div id=\"interpolation_form\">" +
			"							<label for=\"cardinal\">" +
			"								<input type=\"radio\" name=\"interpolation\" id=\"cardinal\" value=\"cardinal\" checked>" +
			"								<span>cardinal</span>" +
			"							</label>" +
			"							<label for=\"linear\">" +
			"								<input type=\"radio\" name=\"interpolation\" id=\"linear\" value=\"linear\">" +
			"								<span>linear</span>" +
			"							</label>" +
			"							<label for=\"step\">" +
			"								<input type=\"radio\" name=\"interpolation\" id=\"step\" value=\"step-after\">" +
			"								<span>step</span>" +
			"							</label>" +
			"						</div>" +
			"					</section>" +
			"					<section></section>" +
			"				</form>" +
			"			</td>" +
			"			<td id=\"chart_column\">" +
			"			<div id=\"chart_container\">" +
			"				<div id=\"chart\"></div>" +
			"				<div id=\"timeline\"></div>" +
			"				<div id=\"preview\"></div>" +
			"			</div>" +
			"			</td>" +
			"		</tr>" +
			"	</table>" +
			"</div>";

		$(canvasSvg).appendTo($visualizationContainer);

		// Loading default colors of D3
		var color = d3.scale.category20();
		var allSeries = [];
		var data = [];

		if (type === "injection") {	// In case we are dealing with INJECTION data..
			allSeries = [
				{ attr:"I-HOUR", name:"Hours", data:[] },
				{ attr:"I-STEAM", name:"Steam", data:[] },
				{ attr:"I-GAS", name:"Gas", data:[] },
				{ attr:"PRESS", name:"Pressure", data:[] },
				{ attr:"I-WATER", name:"Water", data:[] }
			];

			for(var i=0; i<injectionProductionInfo.length; i++) {
				// Adding each element to its correspondent series
				for(var j=0; j<allSeries.length; j++) {
					if(allSeries[j]["attr"] === injectionProductionInfo[i]["i_prod_type"]) {
						allSeries[j]["data"].push(
							{
								y: injectionProductionInfo[i]["i_value"],
								x: new Date( injectionProductionInfo[i]["i_year"], injectionProductionInfo[i]["i_month"]-1,
									1, 0,0,0,0 ).getTime() / 1000
							}
						);
						break;
					}
				}
			}

		} else if (type === "production") {	// In case we are dealing with PRODUCTION data..

			// All the production attributes
			var attributeNames = [
				{ attr: "p_gas", name: "Gas (e³m³)" },
				{ attr: "p_gas_act_day", name: "Gas Actual Day (e³m³/day)" },
				{ attr: "p_gas_cal_day", name: "Gas Calendar Day (e³m³/day)" },
				{ attr: "p_oil", name: "Oil (m³)" },
				{ attr: "p_oil_act_day", name: "Oil Actual Day (m³/day)" },
				{ attr: "p_oil_cal_day", name: "Oil Calendar Day (m³/day)" },
				{ attr: "p_oil_cut", name: "Oil Cut (%)" },
				{ attr: "p_water", name: "Water (m³)" },
				{ attr: "p_water_act_day", name: "Water Actual Day (m³/day)" },
				{ attr: "p_water_cal_day", name: "Water Calendar Day (m³/day)" },
				{ attr: "p_water_cut", name: "Water Cut (%)" },
				{ attr: "p_hours", name: "Hours" },
				{ attr: "p_total_fluid", name: "Total Fluid (m³)" },
				{ attr: "p_total_fluid_act_day", name: "Total Fluid Actual Day (m³/day)" },
				{ attr: "p_total_fluid_cal_day", name: "Total Fluid Calendar Day (m³/day)" },
				{ attr: "p_gas_fluid_ratio", name: "Gas Fluid Ratio" },
				{ attr: "p_gas_oil_ratio", name: "Gas Oil Ratio" },
				{ attr: "p_water_gas_ratio", name: "Water Gas Ratio" },
				{ attr: "p_water_oil_ratio", name: "Water Oil Ratio" },
				{ attr: "p_cml_gas", name: "Cumulative Gas (e³m³)" },
				{ attr: "p_cml_oil_bitu", name: "Cumulative Oil Bitumen (m³)" },
				{ attr: "p_cml_water", name: "Cumulative Water (m³)" },
				{ attr: "p_cml_hours", name: "Cumulative Hours" }
			];

			// Filling allSeries with the attribute names defined in attributeNames array
			for(var i=0; i<attributeNames.length; i++) {
				allSeries.push({ attr: attributeNames[i]["attr"], name: attributeNames[i]["name"], data: [] });
			}

			/*
			 * Going through all the production data and for each attribute name we push the data to the specific
			 * series of allSeries array.
			 */
			for(var i=0; i<injectionProductionInfo.length; i++) {
				for(var j=0; j<attributeNames.length; j++) {
					for(var k=0; k<allSeries.length; k++) {
						if(allSeries[k]["attr"] === attributeNames[j]["attr"]) {
							allSeries[k]["data"].push(
								{
									y: injectionProductionInfo[i][ attributeNames[j]["attr"] ],
									x: new Date( injectionProductionInfo[i]["p_year"], injectionProductionInfo[i]["p_month"]-1,
										1, 0,0,0,0 ).getTime() / 1000
								}
							);
							break;
						}
					}
				}
			}

		}

		// Putting all data together to give it to the chart
		for(var i=0; i<allSeries.length; i++) {
			data.push( { color: color(i), data: allSeries[i]["data"], name: allSeries[i]["name"] } );
		}

		// instantiate our graph!
		var graph = new Rickshaw.Graph( {
			element: document.getElementById("chart"),
			width: 900,
			height: 500,
			renderer: 'line',
			stroke: true,
			preserve: true,
			series: data
		} );

		graph.render();

		var preview = new Rickshaw.Graph.RangeSlider.Preview( {
			graph: graph,
			element: document.getElementById('preview')
		} );

		var hoverDetail = new Rickshaw.Graph.HoverDetail( {
			graph: graph,
			xFormatter: function(x) {
				return d3.time.format("%B %Y")(new Date(x*1000));
			}
			/*xFormatter: function(x) {
				return new Date(x * 1000).toString();
			}*/
		} );

		var annotator = new Rickshaw.Graph.Annotate( {
			graph: graph,
			element: document.getElementById('timeline')
		} );

		var legend = new Rickshaw.Graph.Legend( {
			graph: graph,
			element: document.getElementById('legend')
		} );

		var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
			graph: graph,
			legend: legend
		} );

		var order = new Rickshaw.Graph.Behavior.Series.Order( {
			graph: graph,
			legend: legend
		} );

		var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
			graph: graph,
			legend: legend
		} );

		var smoother = new Rickshaw.Graph.Smoother( {
			graph: graph,
			element: document.querySelector('#smoother')
		} );

		var ticksTreatment = 'glow';

		var xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: graph,
			ticksTreatment: ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		xAxis.render();

		var yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: graph,
			tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment: ticksTreatment
		} );

		yAxis.render();


		var controls = new RenderControls( {
			element: document.querySelector('form'),
			graph: graph
		} );

		// add some data every so often

		var messages = [
			"Changed home page welcome message",
			"Minified JS and CSS",
			"Changed button color from blue to green",
			"Refactored SQL query to use indexed columns",
			"Added additional logging for debugging",
			"Fixed typo",
			"Rewrite conditional logic for clarity",
			"Added documentation for new methods"
		];

		/*
		setInterval( function() {
			random.removeData(seriesData);
			random.addData(seriesData);
			graph.update();
		}, 3000 );

		function addAnnotation(force) {
			if (messages.length > 0 && (force || Math.random() >= 0.95)) {
				annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
				annotator.update();
			}
		}

		addAnnotation(true);
		setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );
		*/

		var previewXAxis = new Rickshaw.Graph.Axis.Time({
			graph: preview.previews[0],
			timeFixture: new Rickshaw.Fixtures.Time.Local(),
			ticksTreatment: ticksTreatment
		});

		previewXAxis.render();

		var resize = function() {
			graph.configure({
				width: $("#canvas-svg").width() * 0.6,
				height: $("#canvas-svg").height() * 0.6
			});
			graph.render();
		}
		window.addEventListener('resize', resize);
		resize();
	}

	VisualizationCharts.prototype.removeCurrentChart = function() {
		$("#canvas-svg").remove();
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).VisualizationCharts = VisualizationCharts;
}).call(this);