
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
		var headers = ["Categorical Classification"];
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories, true), legendName, headers);
	};

	ClassificationController.prototype.classifyWellsByNumericalValues = function(selectedField, classNumber, legendName, method) {
		var wells = self.MapController.getCurrentWells();

		// Clear the categories
		categories = [];
		// Execute the selected classification method
		if(method === 'equal') {
			categories = classifyEqualInterval(selectedField, classNumber, wells);
		} else if(method === 'quantile') {
			categories = classifyQuantile(selectedField, classNumber, wells);
		}

		self.MapController.createClassifiedMarkers(categories, false);
		var headers = ["Numerical Classification", getNumericalClassificationMethod(method)];
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories, false), legendName, headers);
	};

	function getNumericalClassificationMethod(method) {
		var result = "";
		if(method != undefined && method != null && method.length > 0) {
			if(method === 'equal') {
				result = "Equal Interval";
			} else if(method === 'quantile') {
				result = "Quantile";
			}
		}
		return result;
	}

	function classifyEqualInterval(selectedField, classNumber, wells) {
		var result = [];

		var numericalValues = [];
		//get the minimum and maximum value
		for(var i = 0; i < wells.length; i++){
			numericalValues.push(wells[i][selectedField]);
		}
		var min = Math.min.apply(Math, numericalValues);
		var max = Math.max.apply(Math, numericalValues);
		var equalInterval = (max - min)/classNumber;

		for (var i = 0; i < classNumber; i++) {
			var intervalMin = min + i*equalInterval;
			var intervalMax = min + (i+1)*equalInterval;
			result.push(
				{
					intervalMinimum: intervalMin,
					intervalMaximum: intervalMax,
					category:intervalMin.toFixed(2)+" - "+intervalMax.toFixed(2),
					indexes:[]
				});
		}

		for (var i = 0; i < wells.length; i++) {
			for (var j=0; j < result.length; j++) {
				if ((wells[i][selectedField] >= result[j]["intervalMinimum"] && wells[i][selectedField] < result[j]["intervalMaximum"])|| wells[i][selectedField] === result[j]["intervalMaximum"]){
					result[j]["indexes"].push(i);
					break;
				}
			}
		}

		return result;
	}

	function classifyQuantile(selectedField, classNumber, wells) {
		var result = [];

		var totalWells = wells.length;
		var intervalSize = Math.ceil(totalWells / classNumber);
		var tempCategories = [];

		var values = [];
		for(var i = 0; i<totalWells; i++) {
			values.push({ value: wells[i][selectedField], index: i });
		}
		values.sort(function(a, b) { return a.value - b.value; });

		for(var i=0; i<classNumber; i++) {
			result.push(
				{
					intervalMinimum: -1,
					intervalMaximum: -1,
					category: '',
					indexes:[]
				});
			tempCategories.push([]);
		}

		// Filling the categories with an even number of wells
		for(var i = 0; i<totalWells; i++) {
			result[Math.floor(i/intervalSize)]["indexes"].push(values[i]["index"]);
			tempCategories[Math.floor(i/intervalSize)].push(wells[values[i]["index"]][selectedField]);
		}

		// Filling the rest of information for each category
		for(var i=0; i<classNumber; i++) {
			var min = Math.min.apply(Math, tempCategories[i]);
			result[i]["intervalMinimum"] = min;

			if(i > 0) {
				// Filling the max and category values of the previous category
				result[i-1]["intervalMaximum"] = min;
				result[i-1]["category"] = result[i-1]["intervalMinimum"].toFixed(2) + " - " + min.toFixed(2);
			}

			if(i === tempCategories.length - 1) {
				// The last category needs to consider its own max value
				var max = Math.max.apply(Math, tempCategories[i]);

				result[i]["intervalMaximum"] = max;
				result[i]["category"] = min.toFixed(2) + " - " + max.toFixed(2);
			}
		}

		// Sorting the indexes of each category
		for(var i=0; i<result.length; i++) {
			result[i]["indexes"].sort(function(a, b) { return a - b; });
		}

		return result;
	}

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