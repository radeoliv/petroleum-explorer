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
	var $polygonSelectMarkersButton = $('#polygon-select-markers-button');
	var $polygonRemoveMarkersButton = $('#polygon-remove-markers-button');
	var highlightedMarkers = [];

	var PolygonSelection;
	PolygonSelection = function (MapCanvasController){
		this.MapCanvasController = MapCanvasController;
		self = this;
	};

	$myOnOffSwitch.on("change", function() {
		var isChecked = $myOnOffSwitch[0].checked;
		if(isChecked === false) {
			self.MapCanvasController.removePolygon();
		}

		// Enable or disable buttons if the switch is on or off
		$polygonHighlightMarkersButton[0].disabled = !isChecked;
		$polygonSelectMarkersButton[0].disabled = !isChecked;
		$polygonRemoveMarkersButton[0].disabled = !isChecked;
	});

	$polygonHighlightMarkersButton.on("click", function() {
		// markersId contains the ids of the markers as well as their indices
		var markersId = self.MapCanvasController.getMarkersIdInsidePolygon();
		highlightedMarkers = self.MapCanvasController.getHighlightedMarkers();

		if(markersId != undefined && markersId != null && markersId.length > 0) {
			// Saving the markers that were selected to be highlighted
			for(var i=0; i<markersId.length; i++) {
				if($.inArray(markersId[i][0], highlightedMarkers) < 0) {
					highlightedMarkers.push([markersId[i][0], markersId[i][1]]);
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


	(typeof exports !== "undefined" && exports !== null ? exports : window).PolygonSelection = PolygonSelection;
}).call(this);