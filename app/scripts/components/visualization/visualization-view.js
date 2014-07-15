/*--------------------------------------------------------------------------------
	Author: Rodrigo Silva

	petroleum-explorer

	=============================================================================
	Filename: visualization-view.js
	=============================================================================
	This file captures the user input, opens the visualization centre and calls
	the appropriate function from the visualization-controller.
-------------------------------------------------------------------------------*/

(function () {

	// Controlling the active item of the accordion
	var optionAccordion = 0;	// Variable for handling accordion option
	(function () {
		$(function () {
			var active;
			active = function () {
				return visualizationAccordion.on("click", function () {
					optionAccordion = $("#visualizationAccordion").accordion( "option", "active" );
				});
			};
			active();
		});
	}).call(this);

	var lastUwiTyped = "";
	var statusInfo = [];
	var injectionInfo = [];
	var productionInfo= [];
	var controlPanel = $("#control-panel");
	var visualizationAccordion = controlPanel.find("#visualizationAccordion");
	var $applyVisualizationButton = $('#applyVisualization');
	var $clearVisualizationButton = $('#clearVisualization');
	var $pieChartSelection = $('#pie-chart-attributes');
	var $barChartSelection = $('#bar-chart-attributes');
	var $timeSeriesSelection = $('#time-series-attributes');
	var $visualizationTitle = $("#visualization-title");
	var $openVisualizationButton = $("#openVisualization");
	var $timeSeriesUwi = $("#time-series-uwi");

	var barChartTitle = "<i>Bar Chart</i> - ";
	var pieChartTitle = "<i>Pie Chart</i> - ";
	var timeSeriesTitle = "<i>Time Series</i> - ";
	var self;

	var VisualizationView;
	VisualizationView = function (visualizationCharts, fullTable){
		this.visualizationCharts = visualizationCharts;
		this.fullTable = fullTable;
		self = this;
	};

	// The full table dialog must be closed in order to avoid jquery error of 'Maximum call stack size exceeded'
	// This error probably happens due to some incompatibility with the
	$openVisualizationButton.on("click", function(event, param) {
		self.fullTable.closeFullTableDialog();

		if(param === undefined || param === null || param != false) {
			// Every time the visualization centre is opened, the visualization being shown before is reloaded.
			// If there's none selected, nothing will be added.
			$applyVisualizationButton.trigger("click");
		} else {
			// Opens the time series accordion tab/panel
			optionAccordion = 2;
			$("#visualizationAccordion").accordion("option", "active", optionAccordion);

			$timeSeriesUwi.trigger("keyup");
		}
	});

	$timeSeriesUwi.on("propertychange change keyup paste input", function (e) {
		if($timeSeriesUwi[0].value != lastUwiTyped) {
			lastUwiTyped = $timeSeriesUwi[0].value;

			if($timeSeriesUwi[0].value != undefined && $timeSeriesUwi[0].value != null && $timeSeriesUwi[0].value.length === 19) {
				// Checking if the well exists
				var wellInfo = self.visualizationCharts.getInfoFromWell($timeSeriesUwi[0].value);

				var found = wellInfo != undefined && wellInfo != null && wellInfo.length > 0;
				// Append information about result found
				appendInfo(wellInfo, found);

				if(found === true) {
					statusInfo = self.visualizationCharts.getStatusInfoFromWell($timeSeriesUwi[0].value);
					injectionInfo = self.visualizationCharts.getInjectionInfoFromWell($timeSeriesUwi[0].value);
					productionInfo = self.visualizationCharts.getProductionInfoFromWell($timeSeriesUwi[0].value);
				}
			} else {
				$(".time-series-uwi-msg").remove();
			}
		}
	});

	$applyVisualizationButton.on("click", function() {
		switch(optionAccordion) {
			case 0:
				if($barChartSelection[0].value != "none") {
					generateTitle();
					var attribute = $barChartSelection[0].value;
					var attributeText = $barChartSelection[0][$barChartSelection[0].selectedIndex].label;
					self.visualizationCharts.generateBarChart(attribute, attributeText);
				} else {
					self.clearVisualization(true);
				}
				break;
			case 1:
				if($pieChartSelection[0].value != "none") {
					generateTitle();
					self.visualizationCharts.generatePieChart($pieChartSelection[0].value);
				} else {
					self.clearVisualization(true);
				}
				break;
			case 2:
				if($timeSeriesSelection[0].value != "none") {
					if($timeSeriesSelection[0].value === "statuses") {
						if(statusInfo != undefined && statusInfo != null && statusInfo.length > 0) {
							generateTitle();
							self.visualizationCharts.generateTimelineChart(statusInfo, true);
						}
					} else if($timeSeriesSelection[0].value === "injection"){
						if(injectionInfo != undefined && injectionInfo != null && injectionInfo.length > 0) {
							generateTitle();
							// Generate the chart
							self.visualizationCharts.generateInjectionProductionChart(injectionInfo, $timeSeriesSelection[0].value);
						} else {
							// Show message of no data for injection
							self.clearVisualization(false);
							// Setting the option that the user selected
							$timeSeriesSelection[0].value = "injection";

							var alertMessage =
								"<div id=\"canvas-svg\">" +
									"<label id=\"no-data-message\">No injection data available for this well - <b>" + $timeSeriesUwi[0].value + "</b></label>" +
								"</div>";

							$(alertMessage).appendTo($("#visualization-container"));
						}
					} else if($timeSeriesSelection[0].value === "production"){
						if(productionInfo != undefined && productionInfo != null && productionInfo.length > 0) {
							generateTitle();
							// Generate the chart
							self.visualizationCharts.generateInjectionProductionChart(productionInfo, $timeSeriesSelection[0].value);
						} else {
							// Show message of no data for production
							self.clearVisualization(false);
							// Setting the option that the user selected
							$timeSeriesSelection[0].value = "production";

							var alertMessage =
								"<div id=\"canvas-svg\">" +
									"<label id=\"no-data-message\">No production data available for this well - <b>" + $timeSeriesUwi[0].value + "</b></label>" +
									"</div>";

							$(alertMessage).appendTo($("#visualization-container"));
						}
					}
				} else {
					self.clearVisualization(false);
				}
				break;
			default:
				self.clearVisualization(true);
				break;
		}
	});

	function generateTitle() {
		switch(optionAccordion) {
			case 0:
				$visualizationTitle[0].innerHTML = barChartTitle + "<b>" + $barChartSelection[0][$barChartSelection[0].selectedIndex].label + "</b>";
				break;
			case 1:
				$visualizationTitle[0].innerHTML = pieChartTitle + "<b>" + $pieChartSelection[0][$pieChartSelection[0].selectedIndex].label + "</b>";
				break;
			case 2:
				$visualizationTitle[0].innerHTML = timeSeriesTitle + "<b>" + $timeSeriesSelection[0][$timeSeriesSelection[0].selectedIndex].label + "</b>" + " - " + $timeSeriesUwi[0].value;
				break;
			default:
				console.log("No option selected!");
				break;
		}
	}

	$clearVisualizationButton.on("click", function() {
		self.clearVisualization(true);
	});

	VisualizationView.prototype.clearVisualization = function(removeAll) {
		$pieChartSelection[0].value = "none";
		$barChartSelection[0].value = "none";
		$timeSeriesSelection[0].value = "none";
		$visualizationTitle[0].innerHTML = "";
		if(removeAll === true) {
			$timeSeriesUwi[0].value = "";
			$(".time-series-uwi-msg").remove();
		}
		self.visualizationCharts.removeCurrentChart();
	};

	function appendInfo(wellInfo, found) {
		$(".time-series-uwi-msg").remove();
		var divToAppend = '#time-series-uwi-selection';

		var message = found ? "Well found" : "Well not found";
		var id = found ? "uwi-found-msg" : "uwi-not-found-msg";

		var label = "<label id=" + id + " class=\"time-series-uwi-msg\"><b>" + message + "</b></br></label>";
		$(label).appendTo(divToAppend);
	}

	openVisualization = function() {
		$(".open-visualization").magnificPopup({
			type:'inline',
			midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
			removalDelay: 500,
			items: [
				{
					src: '#info-visualization',
					type: 'inline'
				}
			],
			callbacks: {
				beforeOpen: function() {
					this.st.mainClass = this.st.el.attr('data-effect');
				}
			},
			fixedContentPos: true
		});
	};
	openVisualization();

	/*
	 * Allows the accordion in the control panel to be collapsible.
	 */
	visualizationAccordion.accordion({
		collapsible: true,
		heightStyle: "content"
	});

	(typeof exports !== "undefined" && exports !== null ? exports : window).VisualizationView = VisualizationView;
}).call(this);