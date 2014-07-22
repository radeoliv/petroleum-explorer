
/*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	petroleum-explorer

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

(function () {
	var ClassificationController;
	ClassificationController = function (MapController){
		this.MapController = MapController;
		self = this;
	};

	ClassificationController.prototype.generateCategoricalPins = function(selectedValue){
		console.log(selectedValue);
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationController = ClassificationController;
}).call(this);