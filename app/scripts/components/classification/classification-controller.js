
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

	ClassificationController.prototype.classifyWellsByCategory = function(selectedValue, legendName){
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
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories), legendName);
	};

	ClassificationController.prototype.classifyWellsByNumericalValues = function(selectedField, classNumber, legendName){
		var wells = self.MapController.getCurrentWells();
		var numericalValues = [];
		//get the minimum and maximum value
		for(var i = 0; i < wells.length; i++){
			numericalValues.push(wells[i][selectedField]);
		}
		var min = Math.min.apply(Math, numericalValues);
		var max = Math.max.apply(Math, numericalValues);
		var equalInterval = (max - min)/classNumber;

		var intervals = [];
		for (var i = 0; i < classNumber; i++){
			var intervalMin = min + i*equalInterval;
			var intervalMax = min + (i+1)*equalInterval;
			intervals.push({intervalMinimum: intervalMin, intervalMaximum: intervalMax, category:intervalMin+" - "+intervalMax, indexes:[]});
		}

		for (var i = 0; i < wells.length; i++){
			for (var j=0; j < intervals.length; j++){
				if ((wells[i][selectedField] >= intervals[j]["intervalMinimum"] && wells[i][selectedField] < intervals[j]["intervalMaximum"])|| wells[i][selectedField] === intervals[j]["intervalMaximum"]){
					intervals[j]["indexes"].push(i);
 					break;
				}
			}
		}
		self.MapController.createClassifiedMarkers(intervals);
		self.MapController.addClassificationLegend(self.getClassificationLegend(intervals),legendName);
	};

	ClassificationController.prototype.emphasizeMarkersOfCategory = function(legendIndex) {
		// Getting all the indexes of the category clicked
		var markersIndexes = categories[legendIndex]["indexes"];
		// Point out markers in the map
		self.MapController.emphasizeMarkers(markersIndexes, 2000);
	};

	ClassificationController.prototype.getClassificationLegend = function(classificationList) {
		var legendColors = self.MapController.getPinColors();
		var legends = [];
		for (var i=0; i < classificationList.length; i++){
			legends.push({category: classificationList[i]["category"], color: legendColors[i]});
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