$(document).ready(function () {

	var well1 = new google.maps.LatLng(53.132962, -111.055059);
	var well2 = new google.maps.LatLng(53.426225, -110.352643);
	var well3 = new google.maps.LatLng(53.514534, -110.231432);
	var well4 = new google.maps.LatLng(53.454116, -110.357487);
	var well5 = new google.maps.LatLng(53.220488, -110.086663);
	var well6 = new google.maps.LatLng(53.397395, -110.383884);
	var well7 = new google.maps.LatLng(53.236252, -110.183771);
	var well8 = new google.maps.LatLng(53.425696, -110.357384);
	var well9 = new google.maps.LatLng(53.514473, -110.213496);
	var well10 = new google.maps.LatLng(53.177784, -110.745638);
	var well11 = new google.maps.LatLng(53.351187, -110.451518);
	var well12 = new google.maps.LatLng(53.324308, -110.875324);
	var well13 = new google.maps.LatLng(53.514530, -110.219017);
	var well14 = new google.maps.LatLng(53.527138, -110.856952);
	var well15 = new google.maps.LatLng(53.381517, -110.247369);
	var well16 = new google.maps.LatLng(53.222582, -110.150648);
	var well17 = new google.maps.LatLng(53.353531, -110.808913);
	var well18 = new google.maps.LatLng(53.529000, -110.225093);
	var well19 = new google.maps.LatLng(52.860561, -110.024315);
	var well20 = new google.maps.LatLng(53.399181, -110.418865);
	var well21 = new google.maps.LatLng(53.225155, -110.147252);
	var well22 = new google.maps.LatLng(53.326418, -110.418694);
	var well23 = new google.maps.LatLng(53.428565, -110.345724);
	var well24 = new google.maps.LatLng(53.355204, -110.418150);
	var well25 = new google.maps.LatLng(52.936215, -110.042242);
	var well26 = new google.maps.LatLng(53.371227, -110.290203);
	var well27 = new google.maps.LatLng(53.253233, -110.948250);
	var well28 = new google.maps.LatLng(53.518479, -110.244733);
	var well29 = new google.maps.LatLng(53.457330, -110.357768);
	var well30 = new google.maps.LatLng(53.386627, -110.360331);
	var well31 = new google.maps.LatLng(53.502336, -110.211022);
	var well32 = new google.maps.LatLng(53.530787, -110.209879);
	var well33 = new google.maps.LatLng(53.284308, -110.324053);
	var well34 = new google.maps.LatLng(53.387006, -110.353289);
	var well35 = new google.maps.LatLng(53.428727, -110.350826);
	var well36 = new google.maps.LatLng(53.516369, -110.696473);
	var well37 = new google.maps.LatLng(53.357258, -110.811573);
	var well38 = new google.maps.LatLng(53.374117, -110.228015);
	var well39 = new google.maps.LatLng(53.200585, -110.104736);
	var well40 = new google.maps.LatLng(53.417980, -110.350647);
	var well41 = new google.maps.LatLng(53.259412, -110.253425);
	var well42 = new google.maps.LatLng(53.361848, -110.230612);
	var well43 = new google.maps.LatLng(53.360413, -110.445104);
	var well44 = new google.maps.LatLng(52.864811, -110.017227);
	var well45 = new google.maps.LatLng(53.317406, -110.870234);
	var well46 = new google.maps.LatLng(53.506026, -110.211021);
	var well47 = new google.maps.LatLng(53.521816, -110.237609);
	var well48 = new google.maps.LatLng(53.360537, -110.236154);
	var well49 = new google.maps.LatLng(53.536724, -110.238382);
	var well50 = new google.maps.LatLng(53.405323, -110.415865);
	var well51 = new google.maps.LatLng(53.418352, -110.388717);
	var well52 = new google.maps.LatLng(53.331309, -110.899701);
	var well53 = new google.maps.LatLng(53.358828, -110.436515);
	var well54 = new google.maps.LatLng(53.360892, -110.242492);
	var well55 = new google.maps.LatLng(53.464274, -110.102872);
	var well56 = new google.maps.LatLng(53.432577, -110.348115);
	var well57 = new google.maps.LatLng(53.433620, -110.369447);
	var well58 = new google.maps.LatLng(53.259094, -110.268075);
	var well59 = new google.maps.LatLng(53.257392, -110.856814);
	var well60 = new google.maps.LatLng(53.246867, -110.829206);
	var well61 = new google.maps.LatLng(53.421272, -110.344816);
	var well62 = new google.maps.LatLng(53.348132, -110.462757);
	var well63 = new google.maps.LatLng(53.435789, -110.347851);
	var well64 = new google.maps.LatLng(53.379055, -110.239740);
	var well65 = new google.maps.LatLng(53.306015, -110.312361);
	var well66 = new google.maps.LatLng(53.421264, -110.363812);
	var well67 = new google.maps.LatLng(53.364349, -110.241289);
	var well68 = new google.maps.LatLng(53.539855, -110.242689);
	var well69 = new google.maps.LatLng(53.538069, -110.217189);
	var well70 = new google.maps.LatLng(53.378504, -110.234792);
	var well71 = new google.maps.LatLng(53.291636, -110.869067);
	var well72 = new google.maps.LatLng(53.219122, -110.064986);
	var well73 = new google.maps.LatLng(52.867398, -110.013837);
	var well74 = new google.maps.LatLng(53.496276, -110.213517);
	var well75 = new google.maps.LatLng(53.408202, -110.383768);
	var well76 = new google.maps.LatLng(53.423352, -110.385305);
	var well77 = new google.maps.LatLng(53.510985, -110.160601);
	var well78 = new google.maps.LatLng(53.421472, -110.350652);
	var well79 = new google.maps.LatLng(53.509614, -110.204990);
	var well80 = new google.maps.LatLng(53.511029, -110.154151);
	var well81 = new google.maps.LatLng(53.350184, -110.449570);
	var well82 = new google.maps.LatLng(53.365077, -110.301280);
	var well83 = new google.maps.LatLng(53.362770, -110.445109);
	var well84 = new google.maps.LatLng(53.499417, -110.212154);
	var well85 = new google.maps.LatLng(53.236305, -110.161205);
	var well86 = new google.maps.LatLng(53.337156, -110.405390);
	var well87 = new google.maps.LatLng(53.396015, -110.389941);
	var well88 = new google.maps.LatLng(53.122263, -111.024607);
	var well89 = new google.maps.LatLng(53.503572, -110.019163);
	var well90 = new google.maps.LatLng(53.312085, -110.890306);
	var well91 = new google.maps.LatLng(53.429033, -110.383440);
	var well92 = new google.maps.LatLng(53.414631, -110.378532);
	var well93 = new google.maps.LatLng(53.516330, -110.228415);
	var well94 = new google.maps.LatLng(53.356319, -110.423266);
	var well95 = new google.maps.LatLng(53.403903, -110.401346);
	var well96 = new google.maps.LatLng(53.419794, -110.375555);
	var well97 = new google.maps.LatLng(53.405317, -110.409518);
	var well98 = new google.maps.LatLng(53.390694, -110.364831);
	var well99 = new google.maps.LatLng(53.402680, -110.414110);
	var well100 = new google.maps.LatLng(53.315651, -110.873121);
	var well101 = new google.maps.LatLng(53.329513, -110.896663);
	var well102 = new google.maps.LatLng(53.534474, -110.216053);
	var well103 = new google.maps.LatLng(53.258640, -110.854472);
	var well104 = new google.maps.LatLng(53.320766, -110.878615);
	var well105 = new google.maps.LatLng(52.867649, -110.022576);
	var well106 = new google.maps.LatLng(53.408911, -110.391179);
	var well107 = new google.maps.LatLng(53.318746, -110.892184);
	var well108 = new google.maps.LatLng(53.421564, -110.356578);
	var well109 = new google.maps.LatLng(53.523604, -110.234441);
	var well110 = new google.maps.LatLng(53.379369, -110.231289);
	var well111 = new google.maps.LatLng(53.318868, -110.888214);
	var well112 = new google.maps.LatLng(53.523610, -110.228410);
	var well113 = new google.maps.LatLng(53.364150, -110.448350);
	var well114 = new google.maps.LatLng(53.339470, -110.409094);
	var well115 = new google.maps.LatLng(53.373618, -110.231059);
	var well116 = new google.maps.LatLng(53.418726, -110.379284);
	var well117 = new google.maps.LatLng(53.316527, -110.889858);
	var well118 = new google.maps.LatLng(53.123018, -111.043884);

	var locationArray = [well1, well2, well3, well4, well5, well6, well7, well8, well9, well10, well11, well12, well13,
		well14, well15, well16, well17, well18, well19, well20, well21, well22, well23, well24, well25, well26, well27,
		well28, well29, well30, well31, well32, well33, well34, well35, well36, well37, well38, well39, well40, well41,
		well42, well43, well44, well45, well46, well47, well48, well49, well50, well51, well52, well53, well54, well55,
		well56, well57, well58, well59, well60, well61, well62, well63, well64, well65, well66, well67, well68, well69,
		well70, well71, well72, well73, well74, well75, well76, well77, well78, well79, well80, well81, well82, well83,
		well84, well85, well86, well87, well88, well89, well90, well91, well92, well93, well94, well95, well96, well97,
		well98, well99, well100, well101, well102, well103, well104, well105, well106, well107, well108, well109, well110,
		well111, well112, well113, well114, well115, well116, well117, well118];
	var locationNameArray = [
		'00/01-14-048-08W4/0',
		'00/01-27-051-03W4/0',
		'00/01-28-052-02W4/0',
		'00/02-03-052-03W4/0',
		'00/02-16-049-01W4/0',
		'00/02-16-051-03W4/0',
		'00/02-23-049-02W4/0',
		'00/02-27-051-03W4/0',
		'00/02-27-052-02W4/0',
		'00/02-36-048-06W4/0',
		'00/02-36-050-04W4/0',
		'00/03-19-050-06W4/0',
		'00/03-27-052-02W4/0',
		'00/03-32-052-06W4/0',
		'00/04-09-051-02W4/0',
		'00/04-18-049-01W4/0',
		'00/04-34-050-06W4/0',
		'00/04-34-052-02W4/0',
		'00/05-12-045-01W4/0',
		'00/05-17-051-03W4/0',
		'00/05-18-049-01W4/0',
		'00/05-20-050-03W4/0',
		'00/05-26-051-03W4/0',
		'00/05-32-050-03W4/0',
		'00/06-02-046-01W4/0',
		'00/06-06-051-02W4/0',
		'00/06-27-049-07W4/0',
		'00/06-28-052-02W4/0',
		'00/07-03-052-03W4/0',
		'00/07-10-051-03W4/0',
		'00/07-22-052-02W4/0',
		'00/07-34-052-02W4/0',
		'00/08-02-050-03W4/0',
		'00/08-10-051-03W4/0',
		'00/08-27-051-03W4/0',
		'00/08-29-052-05W4/0',
		'00/08-33-050-06W4/0',
		'00/09-04-051-02W4/0',
		'00/09-05-049-01W4/0',
		'00/09-22-051-03W4/0',
		'00/09-29-049-02W4/0',
		'00/09-33-050-02W4/0',
		'00/09-36-050-04W4/0',
		'00/10-12-045-01W4/0',
		'00/10-18-050-06W4/0',
		'00/10-22-052-02W4/0',
		'00/10-28-052-02W4/0',
		'00/10-33-050-02W4/0',
		'00/10-33-052-02W4/0',
		'00/11-17-051-03W4/0',
		'00/11-21-051-03W4/0',
		'00/11-24-050-07W4/0',
		'00/11-31-050-03W4/0',
		'00/11-33-050-02W4/0',
		'00/12-04-052-01W4/0',
		'00/12-26-051-03W4/0',
		'00/12-27-051-03W4/0',
		'00/12-29-049-02W4/0',
		'00/12-29-049-06W4/0',
		'00/13-21-049-06W4/0',
		'00/13-23-051-03W4/0',
		'00/13-25-050-04W4/0',
		'00/13-26-051-03W4/0',
		'00/14-04-051-02W4/0',
		'00/14-12-050-03W4/0',
		'00/14-22-051-03W4/0',
		'00/14-33-050-02W4/0',
		'00/14-33-052-02W4/0',
		'00/14-34-052-02W4/0',
		'00/15-04-051-02W4/0',
		'00/15-06-050-06W4/0',
		'00/15-10-049-01W4/0',
		'00/15-12-045-01W4/0',
		'00/15-15-052-02W4/0',
		'00/15-16-051-03W4/0',
		'00/15-21-051-03W4/0',
		'00/15-24-052-02W4/0',
		'00/16-22-051-03W4/0',
		'00/16-22-052-02W4/0',
		'00/16-24-052-02W4/0',
		'00/16-25-050-04W4/0',
		'00/16-36-050-03W4/0',
		'00/16-36-050-04W4/0',
		'02/02-22-052-02W4/0',
		'02/02-24-049-02W4/0',
		'02/02-29-050-03W4/0',
		'02/03-16-051-03W4/0',
		'02/05-07-048-07W4/0',
		'02/06-24-052-01W4/0',
		'02/07-13-050-07W4/0',
		'02/07-28-051-03W4/0',
		'02/08-21-051-03W4/0',
		'02/08-28-052-02W4/0',
		'02/08-31-050-03W4/0',
		'02/09-17-051-03W4/0',
		'02/09-21-051-03W4/0',
		'02/10-17-051-03W4/0',
		'02/11-10-051-03W4/0',
		'02/11-17-051-03W4/0',
		'02/11-18-050-06W4/0',
		'02/11-24-050-07W4/0',
		'02/11-34-052-02W4/0',
		'02/12-29-049-06W4/0',
		'02/13-18-050-06W4/0',
		'02/14-12-045-01W4/0',
		'02/14-16-051-03W4/0',
		'02/15-13-050-07W4/0',
		'02/15-22-051-03W4/0',
		'02/15-28-052-02W4/0',
		'02/16-04-051-02W4/0',
		'02/16-13-050-07W4/0',
		'02/16-28-052-02W4/0',
		'02/16-36-050-04W4/0',
		'03/03-29-050-03W4/0',
		'03/09-04-051-02W4/0',
		'03/09-21-051-03W4/0',
		'03/10-13-050-07W4/0',
		'05/06-12-048-08W4/0'
	];

	var markers = new Array();

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

		for (var i = 0; i < locationArray.length; i++) {
			marker = new google.maps.Marker({
				position:  locationArray[i],
				map:       map,
				title:     locationNameArray[i],
				draggable: false,
				animation: google.maps.Animation.DROP
			});

			markers.push(marker);

			google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function () {
					var content = "<b>Unique Well Identifier</b><br>" + marker.title;
					infowindow.setContent("<p>" + content + "</p>");
					//infowindow.setContent("Unique Well Identifier: " + marker.title);
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
		for (var i = 0; i < locationArray.length; i++) {
			bounds.extend(locationArray[i]);
		}

		//  Fit these bounds to the map
		map.fitBounds(bounds);
	}

});