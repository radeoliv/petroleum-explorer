/*--------------------------------------------------------------------------------
 Author: Rodrigo Silva

 petroleum-explorer

 =============================================================================
 Filename: map-canvas.js
 =============================================================================
 Contains all the logic to create, display and add wells' information on the map.
 -------------------------------------------------------------------------------*/

(function () {

	// Auxiliar variable
	var self;
	// Full dataSet - all wells
	var dataSet = initializeDataSet();
	// Wells that are being currently displayed - all wells in the beginning
	var currentWells;
	// Markers (pins) shown on the map
	var markers = [];
	// Info window that will be used to in the markers
	var infoWindow = new google.maps.InfoWindow({ maxwidth: 200 });
	// Auxiliar variable to store the highlighted markers
	var highlightedMarkers = [];

	// Create options for the map
	var mapOptions = {
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
		}
	};

	// Define the map itself
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	// The table which links directly with the map
	var FullTableController;

	var MapCanvasController;
	MapCanvasController = function() {
		self = this;
		// Constructor. Not being used.
	};

	/*
	 * Store the full table to link the markers in the future
	 */
	MapCanvasController.prototype.setFullTable = function(tableController) {
		FullTableController = tableController;
	}

	/*
	 * Returns the current wells being displayed
	 */
	MapCanvasController.prototype.getCurrentWells = function() {
		return currentWells;
	}

	/*
	 * Plot the pins of the wells in parameter
	 */
	MapCanvasController.prototype.plotResults = function(wells){
		// The comparison with 'stringify' can only be used because the order of the elements does not change!!!
		// Be careful when using it around to compare JSONs...
		var clearAndInitializeMap = false;

		/*
		 * If wells is null, all the markers/pins should be shown - ONLY if they are not already being shown.
		 * Otherwise, update the map if the wells are different from the ones being shown.
		 */
		if(wells === null && JSON.stringify(this.dataSet) != JSON.stringify(currentWells)) {
			setCurrentWells(dataSet);
			clearAndInitializeMap = true;
		} else if(JSON.stringify(wells) != JSON.stringify(currentWells)) {
			setCurrentWells(wells);
			clearAndInitializeMap = true;
		}

		if(clearAndInitializeMap) {
			clearAllMarkers();
			initializeMap();
		}
	};

	/*
	 * Clear all the markers (pins) on the map
	 */
	function clearAllMarkers() {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}

	/*
	 * Initialize the dataSet with the values in the JSON file
	 */
	function initializeDataSet() {
		// Get JSON file with all information about wells
		var temp;
		$.ajax({
			url: './wells.json',
			dataType:'json',
			async: false,
			success: function(data){
				temp = data;
			}
		});
		// Set as current wells
		setCurrentWells(temp);

		return temp;
	}

	/*
	 * Define the current wells that are going to be shown on the map
	 */
	function setCurrentWells(wells) {
		currentWells = wells;
	}

	/*
	 * Initialize the map with the defined options
	 * Plot the wells' locations
	 * Center the map based on the markers present on the map
	 */
	function initializeMap() {
		/* The points should only be plotted if there's something to be plotted.
		 * This avoids the error of moving the map to a random position (probably the origin) and just makes
		 * the markers disappear, keeping the same location as before.
		 */
		if(currentWells != undefined && currentWells.length > 0) {
			// Don't know why, but setting this property in mapOptions does not work
			map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
			map.set('disableDoubleClickZoom', true);

			// Plot the wells' locations
			plotPoints();
			// Center the map based on markers
			autoCenter();
		}
	}
	initializeMap();

	/*
	 * Highlight specific pins on the map
	 */
	MapCanvasController.prototype.highlightWells = function(UWIsToHighlight, hasToUpdateTable) {

		// Remove the highlighted wells that aren't in the UWIsToHighlight list anymore!
		for(var i=0; i<markers.length; i++) {
			if(markers[i].isHighlighted === true && $.inArray(markers[i].id, UWIsToHighlight) < 0) {
				this.deselectMarker(i, hasToUpdateTable);
			}
		}

		// Then, highlight the ones that are not highlighted!
		for(var i=0; i<currentWells.length; i++) {
			// If the well is in the UWIsToHighlight list, it must be highlighted
			if($.inArray(currentWells[i]["Well_Unique_Identifier"], UWIsToHighlight) >= 0 && markers[i].isHighlighted === false) {
				this.selectMarker(i, hasToUpdateTable);
			}
		}

		/*
		 * If there are others wells that don't match the conditions above, it means that they are correctly
		 * highlighted or correctly not highlighted.
		 */
	}

	/*
	 * Deselects a marker on the map
	 */
	MapCanvasController.prototype.deselectMarker = function(i, hasToUpdateTable, id) {
		toggleMarkerSelection(false, i, hasToUpdateTable);

		for(var i=0; i<highlightedMarkers.length; i++) {
			if(highlightedMarkers[i][0] === id) {
				highlightedMarkers.splice(i, 1);
				break;
			}
		}
	};

	/*
	 * Selects a marker on the map
	 */
	MapCanvasController.prototype.selectMarker = function(i, hasToUpdateTable, id) {
		toggleMarkerSelection(true, i, hasToUpdateTable);
		highlightedMarkers.push([id, i]);
	}

	/*
	 * General function to select or deselect a marker on the map
	 */
	function toggleMarkerSelection(isSelected, i, selectedByPolygon) {
		markers[i].setMap(null);
		markers[i] = null;
		createMarker(currentWells[i], i, isSelected);

		if(selectedByPolygon === true) {
			// Update the full table with the selection
			FullTableController.toggleRowsSelection(currentWells[i]["Well_Unique_Identifier"]);
		}
	}

	/*
	 * Returns all the highlighted markers
	 */
	MapCanvasController.prototype.getHighlightedMarkers = function() {
		return highlightedMarkers;
	}

	/*
	 * Plot points on the map (adding markers/pins)
	 */
	function plotPoints() {
		// Go through all wells and create markers for them
		for (var i = 0; i < currentWells.length; i++) {
			createMarker(currentWells[i], i, false);
		}
	}

	/*
	 * Be careful with the 3 different situations that this function can be called:
	 *  - Creating a marker for the first time (isHighlighted must be null)
	 *  - Updating a marker
	 *    - Highlight it (isHighlighted must be true)
	 *    - ! Highlight it (isHighlighted must be false)
	 */
	function createMarker(well, i, isHighlighted) {

		var iconUrl = 'resources/red-pin.png';
		var animation = google.maps.Animation.DROP;
		if(isHighlighted != null && isHighlighted === true) {
			iconUrl = 'resources/blue-pin.png';
			animation = google.maps.Animation.BOUNCE;
		}

		// Defining new properties to the marker to know if it's highlighted or not
		google.maps.Marker.prototype.isHighlighted = false;
		google.maps.Marker.prototype.id = "";

		// Create a marker
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(well["Latitude Decimal Degrees"], well["Longitude Decimal Degrees"]),
			map: map,
			title: well["Well_Name"],
			draggable: false,
			animation: animation,
			icon: iconUrl
		});
		marker.id = well["Well_Unique_Identifier"];

		/* Adding the new marker on the array of markers.
		 * If the marker is supposed to be highlighted, it is being replaced in the array of markers,
		 * so it must be inserted at the same location as before.
		 */
		if(isHighlighted === null) {
			markers.push(marker);
		} else {
			if(isHighlighted === true) {
				marker.isHighlighted = true;
			}
			markers[i] = marker;
		}

		// Define an event to execute every time a marker/pin is clicked
		// It will show the UWI, Company and Status of a well
		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				var content = "<b>Unique Well Identifier</b><br>" + well["Well_Unique_Identifier"] + "<br><br>"
					+ "<b>Well Operator</b><br>" + well["Well_Operator"] + "<br><br>"
					+ "<b>Well Status</b><br>" + well["Well_Status"] + "<br><hr>";

				// Defining the link to open the charts visualization
				content += "<a id=\"chart-link\" href=\"#charts-popup\" class=\"open-charts\">Show chart</a>";

				// Set the content of the infowindow
				infoWindow.setContent("<p>" + content + "</p>");

				// Defining new property to the info window to know when it's opened or closed
				google.maps.InfoWindow.prototype.opened = false;
				google.maps.Marker.prototype.id = i;
				toggleInfoWindow(infoWindow, map, marker);

				// Using this specific well (and all the rest) to generate the chart
				new InfoGraph().generateChart(well["Well_Unique_Identifier"], currentWells, dataSet);

				/*
				 * Open light box to show the generated charts
				 */
				$('.open-charts').magnificPopup({
					type:'inline',
					midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
					items: [
						{
							src: '#highchart-basic',
							type: 'inline'
						}
					],
					gallery: {
						enabled: true,
						navigateByImgClick: true,
						arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button
						tPrev: 'Previous', // title for left button
						tNext: 'Next', // title for right button
						tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
					},
					fixedContentPos: true
				});
			}
		})(marker, i));

		google.maps.event.addListener(marker, 'rightclick', (function (marker, i) {
			return function () {
				// Toggles the selection
				if(marker.isHighlighted) {
					self.deselectMarker(i, true, marker.id);
				} else {
					self.selectMarker(i, true, marker.id);
				}

				// Making sure to control the info window behaviour
				if(infoWindow.opened === true) {
					infoWindow.opened = false;
					infoWindow.close();
					toggleInfoWindow(infoWindow, map, marker);
				}
			}
		})(marker, i));

		// Used to change the opened property when the user closes the info window by pressing the top right x.
		google.maps.event.addListener(infoWindow,'closeclick',function(){
			infoWindow.opened = false;
		});
	}

	/*
	 * Allow the infoWindow to be opened and closed by clicking on the pin
	 */
	// Last info window opened to control the toggle of opening and closing window. Array contains marker id and InfoWindow
	var lastInfoWindowOpened = [-1, null];
	function toggleInfoWindow(infoWindow, map, marker) {
		if(infoWindow.opened) {
			if(lastInfoWindowOpened[0] != -1 && marker.id != lastInfoWindowOpened[0]) {
				/*
				 * If the last info window opened id and the marker clicked have different ids:
				 * - Close the one that is opened (the last one)
				 * - Open the new one
				 * - Set it as the new last info window opened
				 */
				lastInfoWindowOpened[1].opened = false;
				lastInfoWindowOpened[1].close();
				infoWindow.opened = true;
				infoWindow.open(map, marker);
				lastInfoWindowOpened = [marker.id, infoWindow];
			} else {
				// Closing the opened info window and set the last info window opened as none
				infoWindow.opened = false;
				infoWindow.close();
				lastInfoWindowOpened = [-1, null];
			}
		}
		else {
			// Opening the info window clicked and setting it as the last info window opened
			infoWindow.opened = true;
			infoWindow.open(map, marker);
			lastInfoWindowOpened = [marker.id, infoWindow];
		}
	}

	/*
	 * Fit all markers/pins on the map (defining new center for the map)
	 */
	function autoCenter() {
		// Create a new viewpoint bound
		var bounds = new google.maps.LatLngBounds();

		// Expand the visualization bound considering each marker/pin
		for (var i = 0; i < markers.length; i++) {
			bounds.extend(markers[i]["position"]);
		}

		// Fit these bounds to the map
		map.fitBounds(bounds);
	}




	/* TESTING BEGIN @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
	var poly;
	var path = new google.maps.MVCArray;
	var polygonMarkers = [];

	poly = new google.maps.Polygon({
		strokeWeight: 2,
		fillColor: '#5555FF',
		draggable: true
	});
	poly.setMap(map);
	poly.setPaths(new google.maps.MVCArray([path]));

	// Adding listeners for the possible events
	google.maps.event.addListener(map, 'dblclick', addPoint);

	google.maps.event.addListener(poly, 'drag', function() {
		var vertices = poly.getPath()["j"];
		var numberOfVertices = vertices.length;

		if(numberOfVertices != polygonMarkers.length) {
			return;
		}

		for(var i=0; i<numberOfVertices; i++) {
			polygonMarkers[i].setPosition(vertices[i]);
		}
	});

	function addPoint(event) {
		if($("#myonoffswitch")[0].checked) {

			path.insertAt(path.length, event.latLng);

			var marker = new google.maps.Marker({
				position: event.latLng,
				map: map,
				draggable: true,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 5
				}
			});

			marker.setTitle("#" + path.length);
			polygonMarkers.push(marker);
		}

		google.maps.event.addListener(marker, 'rightclick', function() {
			marker.setMap(null);
			for (var i = 0, I = markers.length; i < I && polygonMarkers[i] != marker; ++i);
			polygonMarkers.splice(i, 1);
			path.removeAt(i);
		});

		google.maps.event.addListener(marker, 'drag', function() {
			for (var i = 0, I = polygonMarkers.length; i < I && polygonMarkers[i] != marker; ++i);
			path.setAt(i, marker.getPosition());
		});
	}

	/*
	 * Returns all the markers that are inside the defined polygon
	 */
	MapCanvasController.prototype.getMarkersIdInsidePolygon = function() {
		// Checking how many markers are inside the polygon
		var markersInside = [];
		for(var i=0; i<markers.length; i++)
		{
			if (google.maps.geometry.poly.containsLocation(markers[i]["position"], poly)) {
				markersInside.push([markers[i]["id"], i]);
			}
		}
		return markersInside;
	};

	/*
	 * Removes the polygon created by adding circular markers
	 */
	MapCanvasController.prototype.removePolygon = function() {
		path = new google.maps.MVCArray;
		poly.setPaths(new google.maps.MVCArray([path]));

		for (var i = 0; i < polygonMarkers.length; i++) {
			polygonMarkers[i].setMap(null);
		}
		polygonMarkers = [];
	};
	/* TESTING END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */


	(typeof exports !== "undefined" && exports !== null ? exports : window).MapCanvasController = MapCanvasController;
}).call(this);