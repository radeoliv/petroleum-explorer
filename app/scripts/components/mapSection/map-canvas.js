/*--------------------------------------------------------------------------------
 Author: Rodrigo Silva

 seng515-petroleum-explorer

 =============================================================================
 Filename: map-canvas.js
 =============================================================================
 Contains all the logic to create, display and add wells' information on the map.
 -------------------------------------------------------------------------------*/

(function () {

	// Full dataSet - all wells
	var dataSet = initializeDataSet();
	// Wells that are being currently displayed - all wells in the beginning
	var currentWells;
	// Markers (pins) shown on the map
	var markers = [];

	// Create options for the map
	var mapOptions = {
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
		}
	};

	// Define the map itself
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var MapCanvasController;

	MapCanvasController = (function(){

		function MapCanvasController(wells){
			setCurrentWells(wells);
		}
	});

	MapCanvasController.prototype.plotResults = function(wells){
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
		setCurrentWells(wells);
		initializeMap();
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
		// Plot the wells' locations
		PlotPoints();
		// Center the map based on markers
		AutoCenter();
	}
	initializeMap();



	/*
	 * Plot points on the map (adding markers/pins)
	 */
	function PlotPoints() {
		var infowindow = new google.maps.InfoWindow({ maxwidth: 200 });

		// Go through all wells and create markers for them
		for (var i = 0; i < currentWells.length; i++) {
			// Create a marker
			var marker = new google.maps.Marker({
				position:  new google.maps.LatLng(currentWells[i]["Latitude Decimal Degrees"], currentWells[i]["Longitude Decimal Degrees"]),
				map:       map,
				title:     currentWells[i]["Well_Name"],
				draggable: false,
				animation: google.maps.Animation.DROP
			});

			// Adding the new marker on the array of markers
			markers.push(marker);

			// Define an event to execute every time a marker/pin is clicked
			// It will show the UWI, Company and Status of a well
			google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function () {
					//var content = "<b>Unique Well Identifier</b><br>" + marker.title;
					var content = "<b>Unique Well Identifier</b><br>" + currentWells[i]["Well_Unique_Identifier"] + "<br><br>"
						+ "<b>Well Operator</b><br>" + currentWells[i]["Well_Operator"] + "<br><br>"
						+ "<b>Well Status</b><br>" + currentWells[i]["Well_Status"] + "<br><br>";

					infowindow.setContent("<p>" + content + "</p>");
					infowindow.open(map, marker);
					//marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			})(marker, i));
		}
	}

	/*
	 * Fit all markers/pins on the map (defining new center for the map)
	 */
	function AutoCenter() {
		// Create a new viewpoint bound
		var bounds = new google.maps.LatLngBounds();

		// Expand the visualization bound considering each marker/pin
		for (var i = 0; i < markers.length; i++) {
			bounds.extend(markers[i]["position"]);
		}

		// Fit these bounds to the map
		map.fitBounds(bounds);
	}

	(typeof exports !== "undefined" && exports !== null ? exports : window).MapCanvasController = MapCanvasController;
}).call(this);