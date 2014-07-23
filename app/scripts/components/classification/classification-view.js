
/*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	petroleum-explorer

	=============================================================================
	Filename: classification-view.js
	=============================================================================
	View class of the classification module.
-------------------------------------------------------------------------------*/
(function () {

	var content = $("#classificationContent");
	var classificationAccordion = content.find("#classificationAccordion");
	var myClassificationOnOffSwitch = $('#myclassificationonoffswitch');
	var categoricalSelection = $('#classification-categorical-fields');
	var numericalSelection = $('#classification-numerical-fields');
	var ClassificationView;
	var self;

	ClassificationView = function(classificationController) {
		this.classificationController = classificationController;
		self = this;
	};

	myClassificationOnOffSwitch.on("change", function() {
		var isChecked = myClassificationOnOffSwitch[0].checked;
		setDisableFields(!isChecked);
	});

	function setDisableFields(isDisabled) {
		categoricalSelection[0].disabled = isDisabled;
		numericalSelection[0].disabled = isDisabled;
	}

	categoricalSelection.on("change",function(){
		self.classificationController.generateCategoricalPins(categoricalSelection[0].value);
	});

	/*
	 * Allows the accordion in the control panel to be collapsible.
	 */
	classificationAccordion.accordion({
		collapsible: true,
		heightStyle: "content"
	});

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationView = ClassificationView;
}).call(this);