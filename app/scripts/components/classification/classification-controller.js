
/*--------------------------------------------------------------------------------
	Author: Bingjie Wei

	petroleum-explorer

	=============================================================================
	Filename: classification-controller.js
	=============================================================================
 	Controller class of the classification module.
-------------------------------------------------------------------------------*/

(function () {
	var categories = [];
	var ClassificationController;
	var self;

	ClassificationController = function (MapController){
		this.MapController = MapController;
		self = this;
	};

	ClassificationController.prototype.classifyWellsByCategory = function(selectedValue){
		categories = [];
		var wells = self.MapController.getCurrentWells();

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
		self.MapController.addClassificationLegend(self.getClassificationLegend());
	};

	ClassificationController.prototype.classifyWellsByNumericalValues = function(selectedField, classNumber){
		categories = [];
		var wells = self.MapController.getCurrentWells();
		var numericalValues = [];
		//get the minimum and maximum value
		for(var i = 0; i < wells.length; i++){
			numericalValues.push(wells[i][selectedField]);
		}
		var min = Math.min.apply(Math, numericalValues);
		var max = Math.max.apply(Math, numericalValues);
		if (classNumber !== "undefined" && classNumber !== null){
			var equalInterval = (max - min)/classNumber;
		}
		console.log(equalInterval);

		for (var i = 0; i < classNumber; i++){
			intervalMin = min + i*equalInterval;
			intervalMax = min + (i+1)*equalInterval;
			categories[i]["category"] = intervalMin +" - " + intervalMax;
			console.log(categories[i]["category"]);
			for (var j = 0; j < wells.length; j++){
				if (wells[j][selectedField] >= intervalMin && wells[j][selectedField] < intervalMax){
					categories[j]["indexes"].push(j);
				}else{
					break;
				}
			}

		}
		self.MapController.createClassifiedMarkers(categories);
	}
	ClassificationController.prototype.emphasizeMarkersOfCategory = function(legendIndex) {
		// Getting all the indexes of the category clicked
		var markersIndexes = categories[legendIndex]["indexes"];
		// Point out markers in the map
		self.MapController.emphasizeMarkers(markersIndexes, 2000);
	};

	ClassificationController.prototype.getClassificationLegend = function() {
		var legendColors = self.MapController.getPinColors();
		var legends = [];
		for (var i=0; i < categories.length; i++){
			legends.push({category: categories[i]["category"], color: legendColors[i]});
		}
		return legends;
	};

	ClassificationController.prototype.resetPins = function() {
		self.MapController.resetPins();
	};

	ClassificationController.prototype.getMap = function() {
		var map = self.MapController.getMap();
		return map;
	};

	(typeof exports !== "undefined" && exports !== null ? exports : window).ClassificationController = ClassificationController;
}).call(this);