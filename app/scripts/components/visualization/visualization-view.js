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
	var optionAccordion;	// Variable for handling accordion option
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

	var controlPanel = $("#control-panel");
	var visualizationAccordion = controlPanel.find("#visualizationAccordion");
	var $applyVisualizationButton = $('#applyVisualization');
	var $clearVisualizationButton = $('#clearVisualization');
	var $pieChartSelection = $('#pie-chart-attributes');
	var $barChartSelection = $('#bar-chart-attributes');
	var $timeSeriesSelection = $('#time-series-attributes');
	var $visualizationTitle = $("#visualization-title");
	var $openVisualizationButton = $("#openVisualization");

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
	$openVisualizationButton.on("click", function() {
		self.fullTable.closeFullTableDialog();
		// Every time the visualization centre is opened, the visualization being shown before is reloaded.
		// If there's none selected, nothing will be added.
		$applyVisualizationButton.trigger("click");
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
					self.clearVisualization();
				}
				break;
			case 1:
				if($pieChartSelection[0].value != "none") {
					generateTitle();
					self.visualizationCharts.generatePieChart($pieChartSelection[0].value);
				} else {
					self.clearVisualization();
				}
				break;
			case 2:
				if($timeSeriesSelection[0].value != "none") {
					generateTitle();
					// Generate the chart
					self.visualizationCharts.generateTimeSeriesChart("");
				} else {
					self.clearVisualization();
				}
				break;
			default:
				self.clearVisualization();
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
				$visualizationTitle[0].innerHTML = timeSeriesTitle + "<b>" + $timeSeriesSelection[0][$timeSeriesSelection[0].selectedIndex].label + "</b>";
				break;
			default:
				console.log("No option selected!");
				break;
		}
	}

	$clearVisualizationButton.on("click", function() {
		self.clearVisualization();
	});

	VisualizationView.prototype.clearVisualization = function() {
		$pieChartSelection[0].value = "none";
		$barChartSelection[0].value = "none";
		$timeSeriesSelection[0].value = "none"
		$visualizationTitle[0].innerHTML = "";
		self.visualizationCharts.removeCurrentChart();
	};

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