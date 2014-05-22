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
	var $resetVisualizationButton = $('#resetVisualization');
	var $pieChartSelection = $('#pie-chart-attributes');
	var $barChartSelection = $('#bar-chart-attributes');
	var $visualizationTitle = $("#visualization-title");

	var barChartTitle = "<i>Bar Chart</i> - ";
	var pieChartTitle = "<i>Pie Chart</i> - ";
	var self;

	var VisualizationView;
	VisualizationView = function (visualizationCharts){
		this.visualizationCharts = visualizationCharts;
		self = this;
	};

	$applyVisualizationButton.on("click", function() {

		switch(optionAccordion) {
			case 0:
				if($barChartSelection[0].value != "none") {
					generateTitle();
					// Generate de bar chart!
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
			default:
				console.log("No option selected!");
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
			default:
				console.log("No option selected!");
				break;
		}
	}

	$resetVisualizationButton.on("click", function() {
		self.clearVisualization();
	});

	VisualizationView.prototype.clearVisualization = function() {
		$pieChartSelection[0].value = "none";
		$barChartSelection[0].value = "none";
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