
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
	var classificationMethods = $("input[name=classification-method]:radio");
	var classesNumberSelection = $("#classes-number");
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
		classesNumberSelection[0].disabled = isDisabled;

		for(var i=0; i<classificationMethods.length; i++) {
			classificationMethods[i].checked = false;
			classificationMethods[i].disabled = isDisabled;
		}
	}

	function clearAllOptions() {
		$("#classification-legend-control").remove();
		categoricalSelection[0].value = 'none';
		numericalSelection[0].value = 'none';
		classesNumberSelection[0].value = 'none';

		for(var i=0; i<classificationMethods.length; i++) {
			if(classificationMethods[i].checked === true) {
				classificationMethods[i].checked = false;
				break;
			}
		}

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
				/*
				 * We check if the numericalSelection is different than 'none' before calling this function.
				 * Therefore, there's no need to check it again.
				 */
				var attrSelection = numericalSelection[0].value;
				var classesNumber = classesNumberSelection[0].value;
				var attrName = numericalSelection[0]["selectedOptions"][0]["innerText"];

				var method = '';
				for(var i=0; i<classificationMethods.length; i++) {
					if(classificationMethods[i].checked === true) {
						method = classificationMethods[i].value;
						break;
					}
				}
				self.classificationController.classifyWellsByNumericalValues(attrSelection, classesNumber, attrName, method);

				createCategoricalLegendEvent();
				clearOtherFields();
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
				classesNumberSelection[0].value = 'none';
				for(var i=0; i<classificationMethods.length; i++) {
					if(classificationMethods[i].checked === true) {
						classificationMethods[i].checked = false;
						break;
					}
				}
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
	classesNumberSelection.on("change", function() {
		if(classesNumberSelection[0].value === 'none') {
			clearAllOptions();
		} else {
			checkNumericalClassificationInputs();
		}
	});
	classificationMethods.on("change", function() {
		checkNumericalClassificationInputs();
	});

	function checkNumericalClassificationInputs() {
		var radioButtonChecked = false;
		for(var i=0; i<classificationMethods.length; i++) {
			if(classificationMethods[i].checked === true) {
				radioButtonChecked = true;
				break;
			}
		}

		if (numericalSelection[0].value != 'none' && radioButtonChecked && classesNumberSelection[0].value != 'none'){
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