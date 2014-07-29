
/*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	petroleum-explorer

	=============================================================================
	Filename: classification-view.js
	=============================================================================
	View class of the classification module.
-------------------------------------------------------------------------------*/
(function () {

	// Controlling the active item of the accordion
	var optionAccordion = 0;	// Variable for handling accordion option
	(function () {
		$(function () {
			var active;
			active = function () {
				return classificationAccordion.on("click", function () {
					optionAccordion = $("#classificationAccordion").accordion( "option", "active" );
				});
			};
			active();
		});
	}).call(this);

	var content = $("#classificationContent");
	var classificationAccordion = content.find("#classificationAccordion");
	var myClassificationOnOffSwitch = $('#myclassificationonoffswitch');
	var categoricalSelection = $('#classification-categorical-fields');
	var numericalSelection = $('#classification-numerical-fields');
	var equalIntervalClassSelection= $("#equal-interval-classes");
	var ClassificationView;
	var self;

	ClassificationView = function(classificationController) {
		this.classificationController = classificationController;
		self = this;
	};

	myClassificationOnOffSwitch.on("change", function() {
		var isChecked = myClassificationOnOffSwitch[0].checked;
		setDisableFields(!isChecked);
		if(isChecked === false) {
			clearAllOptions();
		}
	});

	function setDisableFields(isDisabled) {
		categoricalSelection[0].disabled = isDisabled;
		numericalSelection[0].disabled = isDisabled;
		equalIntervalClassSelection[0].disabled = isDisabled;
	}

	function clearAllOptions() {
		$("#classification-legend-control").remove();
		categoricalSelection[0].value = 'none';
		numericalSelection[0].value = 'none';
		equalIntervalClassSelection[0].value = 'none';

		// Reset the pins on the map
		self.classificationController.resetPins();
	}

	function classifyWells() {
		switch(optionAccordion) {
			case 0:
				if(categoricalSelection[0].value != 'none') {
					self.classificationController.classifyWellsByCategory(categoricalSelection[0].value, categoricalSelection[0]["selectedOptions"][0]["innerText"]);
					createCategoricalLegendEvent();

					clearOtherFields();
				} else {
					clearAllOptions();
				}
				break;
			case 1:
				if(numericalSelection[0].value != 'none') {
					self.classificationController.classifyWellsByNumericalValues(numericalSelection[0].value, equalIntervalClassSelection[0].value, numericalSelection[0]["selectedOptions"][0]["innerText"]);
					createCategoricalLegendEvent();

					clearOtherFields();
				} else {
					clearAllOptions();
				}
				break;
			default:
				console.log("No option selected!");
				clearAllOptions();
				break;
		}
	}

	function clearOtherFields() {
		switch(optionAccordion) {
			case 0:
				// Clear the other fields
				numericalSelection[0].value = 'none';
				equalIntervalClassSelection[0].value = 'none';
				break;
			case 1:
				categoricalSelection[0].value = 'none';
				break;
			default:
				console.log("No option selected!");
				clearAllOptions();
				break;
		}
	}

	categoricalSelection.on("change", function() {
		classifyWells();
	});

	numericalSelection.on("change", function() {
		if(numericalSelection[0].value === 'none') {
			clearAllOptions();
		} else {
			checkNumericalClassificationInputs();
		}
	});
	equalIntervalClassSelection.on("change", function() {
		checkNumericalClassificationInputs();
	});

	function checkNumericalClassificationInputs() {
		if (numericalSelection[0].value != 'none' && equalIntervalClassSelection[0].value != 'none'){
			classifyWells();
		}
	}

	$("body").on("WellsUpdated", function() {
		if(myClassificationOnOffSwitch[0].checked === true) {
			classifyWells();
		}
	});

	function createCategoricalLegendEvent() {
		$(".legend-pin").on("click", function(event) {
			// Getting the index of the pin clicked
			var legendIndex = event["currentTarget"]["id"].substr(11);

			self.classificationController.emphasizeMarkersOfCategory(legendIndex);
		});
	}

	/*
	 * Allows the accordion in the control panel to be collapsible.
	 */
	classificationAccordion.accordion({
		collapsible: true,
		heightStyle: "content"
	});

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationView = ClassificationView;
}).call(this);