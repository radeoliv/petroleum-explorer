/*--------------------------------------------------------------------------------
	Author: Rodrigo Silva

	petroleum-explorer

	=============================================================================
	Filename: polygon-selection.js
	=============================================================================
	Contains all the functions to add markers on the map, creating polygons and
	executing operations such as highlighting, selecting and removing markers
	inside the polygon area.
-------------------------------------------------------------------------------*/

(function () {

	var lastResultSet = null;
	var $myOnOffSwitch = $('#myonoffswitch');
	var $polygonHighlightMarkersButton = $('#polygon-highlight-markers-button');
	var $polygonClearHighlightedMarkersButton = $("#polygon-clear-highlighted-markers-button");
	var $polygonSelectMarkersButton = $('#polygon-select-markers-button');
	var $polygonRemoveMarkersButton = $('#polygon-remove-markers-button');
	var $polygonResetMarkersButton = $('#polygon-reset-markers-button');
	var $polygonRadioButtons = $($("#selectionTable").find("input[type='radio']"));

	var PolygonSelection;
	var self;
	PolygonSelection = function (MapCanvasController, SearchController){
		this.MapCanvasController = MapCanvasController;
		this.SearchController = SearchController;

		self = this;
		createRadioButtonsChangeEventListeners();
	};

	function setDisableButtons(isDisabled) {
		var isClassified = self.MapCanvasController.getUsedClassification();

		$polygonHighlightMarkersButton[0].disabled = isDisabled || isClassified;
		$polygonClearHighlightedMarkersButton[0].disabled = isDisabled || isClassified;

		$polygonSelectMarkersButton[0].disabled = isDisabled;
		$polygonRemoveMarkersButton[0].disabled = isDisabled;
	}

	function setDisableCheckbox(isDisabled) {
		for(var i=0; i<$polygonRadioButtons.length; i++) {
			$polygonRadioButtons[i].disabled = isDisabled;
		}
	}

	$myOnOffSwitch.on("change", function() {
		var isChecked = $myOnOffSwitch[0].checked;
		if(isChecked === false) {
			self.MapCanvasController.removePolygon();
			$(".info-msg").remove();
			setDisableButtons(true);
		}
		setDisableCheckbox(!isChecked);
	});

	function createRadioButtonsChangeEventListeners() {
		for(var i=0; i<$polygonRadioButtons.length; i++) {
			$polygonRadioButtons[i].onclick = function() { $("body").trigger("polygonChangedPosition"); };
		}
	}

	function getMarkersIdInsidePolygon() {
		var selectionCriterion = "";
		if($polygonRadioButtons[0].checked) {
			selectionCriterion = "bottom";
		} else if($polygonRadioButtons[1].checked) {
			selectionCriterion = "top";
		}

		return self.MapCanvasController.getMarkersIdInsidePolygon(selectionCriterion);
	}

	$polygonHighlightMarkersButton.on("click", function() {
		// markersId contains the ids of the markers as well as their indices
		var markersId = getMarkersIdInsidePolygon();
		var highlightedMarkers = self.MapCanvasController.getHighlightedMarkers().slice();

		if(markersId != undefined && markersId != null && markersId.length > 0) {
			// Saving the markers that were selected to be highlighted
			for(var i=0; i<markersId.length; i++) {
				if($.inArray(markersId[i], highlightedMarkers) < 0) {
					highlightedMarkers.push(markersId[i]);
				}
			}

			// Getting only the id of the markers to call the highlight function
			var temp = [];
			for(var i=0; i<highlightedMarkers.length; i++) {
				temp.push(highlightedMarkers[i][0]);
			}

			self.MapCanvasController.highlightWells(temp, true);
		}
	});

	$polygonClearHighlightedMarkersButton.on("click", function() {
		// markersId contains the ids of the markers as well as their indices
		var markersId = getMarkersIdInsidePolygon();

		for(var i=0; i<markersId.length; i++) {
			self.MapCanvasController.deselectMarker(markersId[i][1], true, markersId[i][0]);
		}
	});

	$polygonSelectMarkersButton.on("click", function() {
		saveLastResultSet();

		// markersId contains the ids of the markers as well as their indices
		var markersId = getMarkersIdInsidePolygon();
		if(markersId != undefined && markersId != null && markersId.length > 0) {
			var temp = [];
			for(var i=0; i<markersId.length; i++) {
				temp.push(markersId[i][0]);
			}

			// Update result set, map, full table, and the classification
			self.SearchController.setResultSetByIds(temp);
			self.MapCanvasController.plotResults(self.SearchController.getResultSet());
			$("body").trigger("ResultsUpdated");
			$("body").trigger("WellsUpdated");
		}
	});

	$polygonRemoveMarkersButton.on("click", function() {
		saveLastResultSet();

		// Copying current wells array into another
		var currentWells = self.MapCanvasController.getCurrentWells().concat();

		// markersId contains the ids of the markers as well as their indices
		var markersId = getMarkersIdInsidePolygon();
		if(markersId != undefined && markersId != null && markersId.length > 0) {
			var temp = [];
			for(var i=0; i<markersId.length; i++) {
				temp.push(markersId[i][0]);
			}

			// Update result set, map and full table
			self.SearchController.setResultSetByIdsInverse(currentWells, temp);
			self.MapCanvasController.plotResults(self.SearchController.getResultSet());
			$("body").trigger("ResultsUpdated");
			$("body").trigger("WellsUpdated");
		}
	});

	$polygonResetMarkersButton.on("click", function() {
		// Which one is the best? To always reset the result set or to make it the same as it was before?
		// Inconsistency can happen in both cases..
		self.SearchController.resetResultSet();
		//self.SearchController.setResultSet(lastResultSet);

		self.MapCanvasController.plotResults(self.SearchController.getResultSet());
		$("body").trigger("ResultsUpdated");
		$("body").trigger("WellsUpdated");

		$polygonResetMarkersButton[0].disabled = true;
	});

	$("body").on("polygonChangedPosition", (function () {
		var markers = getMarkersIdInsidePolygon();
		appendInfo(markers.length);

		if(markers === undefined || markers === null || markers.length === 0) {
			setDisableButtons(true);
		} else {
			setDisableButtons(false);
		}
	}));

	function appendInfo(currentMarkers) {
		$(".info-msg").remove();
		var message = currentMarkers + (currentMarkers === 1 ? " well intersected" : " wells intersected");
		var divToAppend = '.selection-form';
		$('<label class = "info-msg"><b>' + message + '</b></br></label>').appendTo(divToAppend);
	}

	function saveLastResultSet() {
		if(lastResultSet === undefined || lastResultSet === null) {
			lastResultSet = self.SearchController.getResultSet();
		}
	}

	$("body").on("resultSetChanged", function() {
		$polygonResetMarkersButton[0].disabled = !self.SearchController.isResultNotSetBySearch();

		if(self.SearchController.isResultNotSetBySearch() === false) {
			lastResultSet = null;
		}
	});

	(typeof exports !== "undefined" && exports !== null ? exports : window).PolygonSelection = PolygonSelection;
}).call(this);