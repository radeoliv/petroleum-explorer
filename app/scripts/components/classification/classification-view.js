
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
		if(isChecked === false) {
			clearAllOptions();

			// Reset the pins on the map
			self.classificationController.resetPins();
		}
	});

	function setDisableFields(isDisabled) {
		categoricalSelection[0].disabled = isDisabled;
		numericalSelection[0].disabled = isDisabled;
	}

	function clearAllOptions() {
		$("#classification-legend").remove();
		categoricalSelection[0].value = '';
		numericalSelection[0].value = '';
	}

	categoricalSelection.on("change",function(){
		self.classificationController.generateCategoricalPins(categoricalSelection[0].value);
		appendLegend();
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
			append += '<input type=\"image\" src=\"./resources/'+legends[i]["color"]+'-pin-smaller.png\" id=\"legend-pin-' + i + '\" class=\"legend-pin\">';
			append += '</td>';
			append += '<td>';
			append += '<label class = \"legend\">'+category+'</label>';
			append += '</td>';
			append += '</tr>';
		}

		append += "</table></div>";
		$(append).appendTo(divToAppend);

		$(".legend-pin").on("click", function(event) {
			// Getting the index of the pin clicked
			var legendIndex = event["currentTarget"]["id"].substr(11);

			self.classificationController.bounceMarkersOfCategory(legendIndex);
		});
	}

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationView = ClassificationView;
}).call(this);