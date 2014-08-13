
/*--------------------------------------------------------------------------------
 Author: Bingjie Wei

 petroleum-explorer

 =============================================================================
 Filename: classification-controller.js
 =============================================================================
 Controller class of the classification module.
 -------------------------------------------------------------------------------*/

(function () {
	var wellsWithStatistics = [];
	var categories = [];
	var ClassificationController;
	var self;

	ClassificationController = function (MapController){
		this.MapController = MapController;
		self = this;

		// Load the wells with average statistics
		getWellsWithStatistics();
	};

	function getWellsWithStatistics() {
		$.ajax({
			url: 'http://localhost:3000/getAllWellsWithAverageStatistics/',
			dataType:'json',
			async: false,
			success: function(data) {
				wellsWithStatistics = data;
			}
		});
	}

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
		var headers = ["Categorical Classification"];
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories), legendName, headers);
	};

	ClassificationController.prototype.classifyWellsByNumericalValues = function(selectedField, classNumber, legendName, method) {
		var currentWellsWithStatistics = [];
		var wells = self.MapController.getCurrentWells();

		for(var i=0; i<wells.length; i++) {
			currentWellsWithStatistics.push(wellsWithStatistics[wells[i]["w_id"] - 1]);
		}

		// Clear the categories
		categories = [];
		// Execute the selected classification method
		if(method === 'equal') {
			categories = classifyEqualInterval(selectedField, classNumber, currentWellsWithStatistics);
		} else if(method === 'quantile') {
			categories = classifyQuantile(selectedField, classNumber, currentWellsWithStatistics);
		}

		self.MapController.createClassifiedMarkers(categories);
		var headers = ["Numerical Classification", getNumericalClassificationMethod(method)];
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories), legendName, headers);
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
		var hasNullValues = false;

		for(var i = 0; i < wells.length; i++) {
			if(wells[i][selectedField] != null ) {
				numericalValues.push(wells[i][selectedField]);
			} else {
				hasNullValues = true;
			}
		}

		// Get the minimum and maximum value
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

		if(hasNullValues === true) {
			result.push(
				{
					intervalMinimum: null,
					intervalMaximum: null,
					category: "Invalid",
					indexes:[]
				});
		}

		for (var i = 0; i < wells.length; i++) {
			for (var j=0; j < result.length; j++) {
				if(wells[i][selectedField] != null && result[j]["category"] != "Invalid") {
					if ((wells[i][selectedField] >= result[j]["intervalMinimum"] && wells[i][selectedField] < result[j]["intervalMaximum"])|| wells[i][selectedField] === result[j]["intervalMaximum"]){
						result[j]["indexes"].push(i);
						break;
					}
				} else if(wells[i][selectedField] === null && result[j]["category"] === "Invalid") {
					result[j]["indexes"].push(i);
					break;
				}
			}
		}

		return result;
	}

	function classifyQuantile(selectedField, classNumber, wells) {
		var result = [];
		var validWells = [];
		var invalidWells = [];

		for(var i=0; i<wells.length; i++) {
			if(wells[i][selectedField] != null) {
				validWells.push({ well: wells[i], index: i });
			} else {
				invalidWells.push(i);
			}
		}

		var totalWells = validWells.length;
		var intervalSize = Math.ceil(totalWells / classNumber);
		var tempCategories = [];

		var values = [];
		for(var i = 0; i<totalWells; i++) {
			values.push({ value: validWells[i]["well"][selectedField], index: validWells[i]["index"] });
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

		// Adding the invalid wells
		if(invalidWells.length > 0) {
			result.push({
				intervalMinimum: null,
				intervalMaximum: null,
				category: "Invalid",
				indexes: invalidWells
			});
		}

		return result;
	}

	ClassificationController.prototype.clusterKMeans = function(attributesValues, clusterNumber) {
		var wells = self.MapController.getCurrentWells();

		var uwis = '';
		for(var i=0; i<wells.length; i++) {
			uwis += (i === wells.length - 1) ? (wells[i]["w_uwi"]) : (wells[i]["w_uwi"]) + ",";
		}

		var attributes = [];
		for(var i=0; i<attributesValues.length; i++) {
			attributes.push(attributesValues[i].value);
		}
		attributes = attributes.join();

		var encodedParams = encodeURIComponent(attributes + "&" + clusterNumber + "&" + uwis);

		var result = [];
		$.ajax({
			url: 'http://localhost:3000/applyKmeansToWells/' + encodedParams,
			dataType:'json',
			async: false,
			success: function(data) {
				result = data;
			}
		});

		//console.log(result);

		// Clearing the previous categories
		categories = [];

		for(var i=0; i<result.length; i++) {
			categories.push( {
				intervalMinimum: -1,
				intervalMaximum: -1,
				category: 'Cluster ' + (i+1),
				indexes:[]
			});
			for(var j=0; j<result[i].length; j++) {
				categories[i]["indexes"].push(result[i][j]["index"]);
			}
		}

		// Sorting the indexes of each category
		for(var i=0; i<categories.length; i++) {
			categories[i]["indexes"].sort(function(a, b) { return a - b; });
		}

		self.MapController.createClassifiedMarkers(categories);
		var headers = ["K-means Clustering"];
		var tempName = [];
		for(var i=0; i<attributesValues.length; i++) {
			tempName.push(attributesValues[i].name);
		}
		headers.push(tempName.join(", "));
		self.MapController.addClassificationLegend(self.getClassificationLegend(categories), null, headers);
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
			var auxColor = classificationList[i]["category"] === "Invalid" ? "black": legendColors[i];
			legends.push({
				category: classificationList[i]["category"],
				indexesCount:classificationList[i]["indexes"].length,
				color: auxColor
			});
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