$(document).ready(function () {

	var dataSet = initializeDataSet();
	var markers = new Array();
	var currentWells;

	function initializeDataSet() {
		//parse JSON file with all informations about wells
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

	function setCurrentWells(wells) {
		currentWells = wells;
	}

	function getLocations(wells) {
		//"Longitude Decimal Degrees"
		//"Latitude Decimal Degrees"
		var tempArray = [];
		wells.forEach(function(well){
			tempArray.push(new google.maps.LatLng(well["Latitude Decimal Degrees"], well["Longitude Decimal Degrees"]));
		});
		return tempArray;
	}

	function initializeMap() {
		var mapOptions = {
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
			}
		};

		var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		PlotPoints(map);
		AutoCenter(map);
	}
	initializeMap();

	function PlotPoints(map) {
		var marker;
		var infowindow = new google.maps.InfoWindow({ maxwidth: 200 });

		for (var i = 0; i < currentWells.length; i++) {
			marker = new google.maps.Marker({
				position:  new google.maps.LatLng(currentWells[i]["Latitude Decimal Degrees"], currentWells[i]["Longitude Decimal Degrees"]),
				map:       map,
				title:     currentWells[i]["Well_Name"],
				draggable: false,
				animation: google.maps.Animation.DROP
			});

			markers.push(marker);

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

	function AutoCenter(map) {
		//  Create a new viewpoint bound
		var bounds = new google.maps.LatLngBounds();

		//  Go through each...
		for (var i = 0; i < markers.length; i++) {
			bounds.extend(markers[i]["position"]);
		}

		//  Fit these bounds to the map
		map.fitBounds(bounds);
	}
});