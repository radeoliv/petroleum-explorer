
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
		var wells = self.MapController.getCurrentWells();

		var categories = [];
		for(var i = 0; i < wells.length; i++){
			var inserted = false;
			for(var j =0; j < categories.length; j++){
				if (categories[j]["category"] === wells[i][selectedValue]){
					categories[j]["indexes"].push(i);
					inserted = true;
					break;
				}
			}
			if (inserted === false){
				categories.push({category:wells[i][selectedValue],indexes:[i]});
			}
		}

		self.MapController.createClassifiedMarkers(categories);
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationController = ClassificationController;
}).call(this);