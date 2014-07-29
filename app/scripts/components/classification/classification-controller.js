
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

		self.MapController.createClassifiedMarkers(categories, true);
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories, true), legendName);
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

		categories = [];
		for (var i = 0; i < classNumber; i++){
			var intervalMin = min + i*equalInterval;
			var intervalMax = min + (i+1)*equalInterval;
			categories.push({intervalMinimum: intervalMin, intervalMaximum: intervalMax, category:intervalMin.toFixed(2)+" - "+intervalMax.toFixed(2), indexes:[]});
		}

		for (var i = 0; i < wells.length; i++){
			for (var j=0; j < categories.length; j++){
				if ((wells[i][selectedField] >= categories[j]["intervalMinimum"] && wells[i][selectedField] < categories[j]["intervalMaximum"])|| wells[i][selectedField] === categories[j]["intervalMaximum"]){
					categories[j]["indexes"].push(i);
 					break;
				}
			}
		}
		self.MapController.createClassifiedMarkers(categories, false);
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories, false), legendName);
	};

	ClassificationController.prototype.emphasizeMarkersOfCategory = function(legendIndex) {
		// Getting all the indexes of the category clicked
		var markersIndexes = categories[legendIndex]["indexes"];
		// Point out markers in the map
		self.MapController.emphasizeMarkers(markersIndexes, 2000);
	};

	ClassificationController.prototype.getClassificationLegend = function(classificationList, isCategorical) {
		var legendColors = self.MapController.getPinColors(isCategorical);
		var legends = [];
		for (var i=0; i < classificationList.length; i++){
			legends.push({category: classificationList[i]["category"], indexesCount:classificationList[i]["indexes"].length, color: legendColors[i]});
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