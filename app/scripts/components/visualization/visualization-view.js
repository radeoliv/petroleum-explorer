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

	var controlPanel = $("#control-panel");
	var visualizationAccordion = controlPanel.find("#visualizationAccordion");
	var $visualizationButton = $('#visualizationButton');
	var self;

	var VisualizationView;
	VisualizationView = function (visualizationController){
		//this.visualizationController = visualizationController;
		self = this;
	};

	openVisualization = function() {
		$(".open-visualization").magnificPopup({
			//delegate: 'a',
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

	/*
	 * Allows the accordion in the control panel to be collapsible.
	 */
	visualizationAccordion.accordion({
		collapsible: true,
		heightStyle: "content"
	});

	openVisualization();

	(typeof exports !== "undefined" && exports !== null ? exports : window).VisualizationView = VisualizationView;
}).call(this);