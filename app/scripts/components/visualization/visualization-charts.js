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
			$('<div id=\"canvas-svg\"></div>').appendTo($visualizationContainer);

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
					.transition().delay(function (d,i){ return i * 15;}).duration(200)
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

	VisualizationCharts.prototype.generateTimeSeriesChart = function(attribute) {
		var parseDate = d3.time.format("%b %Y").parse;

		/*var dates = ["Jan 2000","Feb 2000","Mar 2000","Apr 2000","May 2000","Jun 2000","Jul 2000","Aug 2000",//"Sep 2000","Oct 2000","Nov 2000","Dec 2000",
		//"Jan 2001","Feb 2001","Mar 2001","Apr 2001","May 2001","Jun 2001","Jul 2001",
			"Aug 2001","Sep 2001","Oct 2001","Nov 2001","Dec 2001"];*/
		var dates = ["Dec 2005", "Jan 2006", "May 2006"];
		var values = [1,2,3,4,5,6,7,8,9,10,11,12,11,10,9,8,7,6,5,4,3,2,1,0];

		var dataTest = [];
		for(var i=0; i<dates.length; i++) {
			dataTest.push({"date": parseDate(dates[i]), "price":values[i]});
		}

		/* TESTING STUFF */
		this.removeCurrentChart();
		$('<div id=\"canvas-svg\"></div>').appendTo($visualizationContainer);
		/* TESTING STUFF */
		/* Testing stuff ^^^^^^^^ */

		var margin = {top: 10, right: 10, bottom: 100, left: 40},
			margin2 = {top: 430, right: 10, bottom: 20, left: 40},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom,
			height2 = 500 - margin2.top - margin2.bottom;

		var x = d3.time.scale().range([0, width]),
			x2 = d3.time.scale().range([0, width]),
			y = d3.scale.linear().range([height, 0]),
			y2 = d3.scale.linear().range([height2, 0]);

		var xAxis = d3.svg.axis().scale(x).orient("bottom"),
			xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
			yAxis = d3.svg.axis().scale(y).orient("left");

		var brush = d3.svg.brush()
			.x(x2)
			.on("brush", brushed);

		var area = d3.svg.area()
			//.interpolate("monotone")
			.interpolate("cardinal").tension(0.94)
			//.interpolate("linear")
			.x(function(d) { return x(d.date); })
			.y0(height)
			.y1(function(d) { return y(d.price); });

		var area2 = d3.svg.area()
			//.interpolate("monotone")
			.interpolate("cardinal").tension(0.94)
			//.interpolate("linear")
			.x(function(d) { return x2(d.date); })
			.y0(height2)
			.y1(function(d) { return y2(d.price); });

		var svg = d3.select("#canvas-svg").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);

		var focus = svg.append("g")
			.attr("class", "focus")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var context = svg.append("g")
			.attr("class", "context")
			.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

		//d3.csv("./sp500.csv", type, function(error, data) {
			x.domain(d3.extent(dataTest.map(function(d) { return d.date; })));
			y.domain([0, d3.max(dataTest.map(function(d) { return d.price; }))]);
			x2.domain(x.domain());
			y2.domain(y.domain());

			focus.append("path")
				.datum(dataTest)
				.attr("class", "area")
				.attr("d", area);

			focus.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			focus.append("g")
				.attr("class", "y axis")
				.call(yAxis);

			context.append("path")
				.datum(dataTest)
				.attr("class", "area")
				.attr("d", area2);

			context.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height2 + ")")
				.call(xAxis2);

			context.append("g")
				.attr("class", "x brush")
				.call(brush)
				.selectAll("rect")
				.attr("y", -6)
				.attr("height", height2 + 7);
		//});

		function brushed() {
			x.domain(brush.empty() ? x2.domain() : brush.extent());
			focus.select(".area").attr("d", area);
			focus.select(".x.axis").call(xAxis);
		}

		function type(d) {
			d.date = parseDate(d.date);
			d.price = +d.price;
			return d;
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

	VisualizationCharts.prototype.generateTimelineChart = function(statusInfo) {
		this.removeCurrentChart();
		$('<div id=\"canvas-svg\"></div>').appendTo($visualizationContainer);

		var width = 800,
			height = 600,
			radius = Math.min(width, height) / 2.5;

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
			data.forEach(function(element, index, array) {
				if(element["status"] === statusInfo[i]["s_status"]) {
					element["times"].push(times);
					res = true;
					return;
				}
			});

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
				statuses.forEach(function(element, index, array) {
					statusCategory.push(element["s_status"]);
				});
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
		var marginTop = height / 5;
		var legendX = width - width/4;
		var legendY = -height/8;

		var tooltipDiv;
		var chart = d3.timeline()
			.width(width)
			.margin({left:70,right:30,top:marginTop,bottom:0})
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

				// Making the legend rectangle visible
				d3.select("#legend-rectangle")
					.style("opacity", 1.0);
			})
			.mouseout(function() {
				// Removing all text information
				d3.selectAll(".text-info").remove();
				// Making the legend rectangle invisible
				d3.select("#legend-rectangle")
					.style("opacity", 0.0);
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
				.attr("x", (legendX + 10))
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
			.attr("height", "98%")
			.attr("viewBox", "0 0 " + (width) + " " + (height/2))
			.datum(data).call(chart);

		// Loading default colors of D3
		var color = d3.scale.category20();

		var legend = svg.append("g")
			.attr("class","legend")
			.attr("x", 60)
			.attr("y", -60)
			.attr("height", 100)
			.attr("width", 100);

		legend.selectAll('g')
			.data(statusCategory)
			.enter()
			.append('g')
			.each(function(d,i) {
				var g=d3.select(this);
				g.append("svg:rect")
					.attr("x", 20)
					.attr("y", -100+i*15)
					.attr("height", 10)
					.attr("width", 30)
					.style({
						"fill":function() {
							if(i < data.length) {
								return color(i);
							} else {
								return "grey";
							}
						},
						"opacity":function() {
							if(i < data.length) {
								return 1.0;
							} else {
								return 0.5;
							}
						}
					});
				g.append("svg:text")
					.attr("x", 55)
					.attr("y", -91+i*15)
					.attr("font-size","0.8em")
					.style({
						"opacity":function() {
							if(i < data.length) {
								return 1.0;
							} else {
								return 0.5;
							}
						}
					})
					.text(statusCategory[i]);
			});

		var rect = svg.append("rect")
			.attr("id", "legend-rectangle")
			.attr("x", legendX)
			.attr("y", legendY)
			.attr("width", (width / 6))
			.attr("height", (height / 4.4))
			.style({
				"fill": "none",
				"stroke": "black",
				"stroke-width": "0.05em",
				"opacity": 1.0
			});

		// Fixing margin when window is resized
		window.onresize = function() {

			var container = $("#canvas-svg");
			var clientHeight = container[0].clientHeight;
			var clientWidth = container[0].clientWidth;

			console.log(clientHeight + " " + clientWidth);
		}
	}

	VisualizationCharts.prototype.removeCurrentChart = function() {
		$("#canvas-svg").remove();
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).VisualizationCharts = VisualizationCharts;
}).call(this);