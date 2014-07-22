
/*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	petroleum-explorer

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: file description
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
	var categoricalSelected = $('#classification-categorical-fields');
	var ClassificationView;
	var self;
	ClassificationView = function(classificationController) {
		this.classificationController = classificationController;
		self = this;
	};

	function setDisableFields(isDisabled) {
		categoricalSelected[0].disabled = isDisabled;
	}
	myClassificationOnOffSwitch.on("change", function() {
		var isChecked = myClassificationOnOffSwitch[0].checked;
		setDisableFields(!isChecked);
	});

	categoricalSelected.on("change",function(){
		self.classificationController.generateCategoricalPins(categoricalSelected[0].value);
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