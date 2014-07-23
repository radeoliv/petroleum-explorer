
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
		$("#classification-legend").remove();
		categoricalSelection[0].value = '';
		numericalSelection[0].value = '';
	});

	function setDisableFields(isDisabled) {
		categoricalSelection[0].disabled = isDisabled;
		numericalSelection[0].disabled = isDisabled;
	}

	categoricalSelection.on("change",function(){
		self.classificationController.generateCategoricalPins(categoricalSelection[0].value);
		appendLegend();
		console.log(categoricalSelection[0].value);
	});

	/*
	 * Allows the accordion in the control panel to be collapsible.
	 */
	classificationAccordion.accordion({
		collapsible: true,
		heightStyle: "content"
	});

	function appendLegend(){
		$("#classification-legend").remove();
		var divToAppend = '.classification-form';
		var legends = self.classificationController.getClassificationLegend();

		var append = "<div id = \"classification-legend\"><table id =\"legend-table\">";

		for(var i=0; i < legends.length; i++){
			var category = legends[i]["category"][0] + legends[i]["category"].substr(1).toLowerCase();
			append += '<tr>';
			append += '<td id = \"pin-column\">';
			append += '<img src=\"./resources/'+legends[i]["color"]+'-pin-small.png\">';
			append += '</td>';
			append += '<td>';
			append += '<label class = \"legend\">'+category+'</label>';
			append += '</td>';
			append += '</tr>';
		}

		append += "</table></div>";
		$(append).appendTo(divToAppend);
	}

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationView = ClassificationView;
}).call(this);