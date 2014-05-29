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

	var $myOnOffSwitch = $('#myonoffswitch');
	var $polygonHighlightMarkersButton = $('#polygon-highlight-markers-button');
	var $polygonClearHighlightedMarkersButton = $("#polygon-clear-highlighted-markers-button");
	var $polygonSelectMarkersButton = $('#polygon-select-markers-button');
	var $polygonRemoveMarkersButton = $('#polygon-remove-markers-button');
	var highlightedMarkers = [];

	var PolygonSelection;
	PolygonSelection = function (MapCanvasController, SearchController){
		this.MapCanvasController = MapCanvasController;
		this.SearchController = SearchController;

		self = this;
	};

	$myOnOffSwitch.on("change", function() {
		var isChecked = $myOnOffSwitch[0].checked;
		if(isChecked === false) {
			self.MapCanvasController.removePolygon();
			$(".info-msg").remove();
		}

		// Enable or disable buttons if the switch is on or off
		$polygonHighlightMarkersButton[0].disabled = !isChecked;
		$polygonClearHighlightedMarkersButton[0].disabled = !isChecked;
		$polygonSelectMarkersButton[0].disabled = !isChecked;
		$polygonRemoveMarkersButton[0].disabled = !isChecked;
	});

	$polygonHighlightMarkersButton.on("click", function() {
		// markersId contains the ids of the markers as well as their indices
		var markersId = self.MapCanvasController.getMarkersIdInsidePolygon();
		highlightedMarkers = self.MapCanvasController.getHighlightedMarkers().slice();

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
		var markersId = self.MapCanvasController.getMarkersIdInsidePolygon();

		for(var i=0; i<markersId.length; i++) {
			self.MapCanvasController.deselectMarker(markersId[i][1], true, markersId[i][0]);
		}
	});

	$polygonSelectMarkersButton.on("click", function() {
		// markersId contains the ids of the markers as well as their indices
		var markersId = self.MapCanvasController.getMarkersIdInsidePolygon();
		if(markersId != undefined && markersId != null && markersId.length > 0) {
			var temp = [];
			for(var i=0; i<markersId.length; i++) {
				temp.push(markersId[i][0]);
			}

			self.SearchController.setResultSetByIds(temp);
			self.MapCanvasController.plotResults(self.SearchController.getResultSet());
			$("body").trigger("ResultsUpdated");
		}
	});

	$polygonRemoveMarkersButton.on("click", function() {
		// markersId contains the ids of the markers as well as their indices
		var markersId = self.MapCanvasController.getMarkersIdInsidePolygon();
		if(markersId != undefined && markersId != null && markersId.length > 0) {
			var temp = [];
			for(var i=0; i<markersId.length; i++) {
				temp.push(markersId[i][0]);
			}

			var currentWells = self.MapCanvasController.getCurrentWells();
			// Get all the wells and remove the selected ones...
			// The rest of the process should be the same as the selection right above this method

			//self.SearchController.setResultSetByIds(temp);
			//self.MapCanvasController.plotResults(self.SearchController.getResultSet());
			//$("body").trigger("ResultsUpdated");
		}
	});

	$("body").on("polygonChangedPosition", (function () {
		var markers = self.MapCanvasController.getMarkersIdInsidePolygon();
		appendInfo(markers.length);
	}));

	function appendInfo(currentMarkers) {
		$(".info-msg").remove();
		var message = currentMarkers + (currentMarkers === 1 ? " well intersected" : " wells intersected");
		var divToAppend = '.selection-form';
		$('<label class = "info-msg"><b>' + message + '</b></br></label>').appendTo(divToAppend);
	}

	(typeof exports !== "undefined" && exports !== null ? exports : window).PolygonSelection = PolygonSelection;
}).call(this);