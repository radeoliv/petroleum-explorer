 /*--------------------------------------------------------------------------------
	Author: Rodrigo Silva
	github: https://github.com/srsgores

	seng515-petroleum-explorer

	=============================================================================
	Filename: info-graph.js
	=============================================================================
	This file is responsible to generate the default chart (oil production).
-------------------------------------------------------------------------------*/
 (function () {

	 var index = 0;
	 var minimums = [1,2,3,4,5,6,7];
	 var maximums = [10, 20, 30 ,40 ,50, 60, 70];
	 var wellsList;
	 var maxList;
	 var minList;

	 var InfoGraph;

	 InfoGraph = (function(){
		 function InfoGraph(){
			/*wellsList = wells;
			maxList = maxs;
			minList = mins;*/
		 }
	 });

	 var self = this;

	 InfoGraph.prototype.getMinMaxValues = function(allWells) {
		var attributesToConsider = ["PHIc", "PHIR", "Vshc", "Soc", "KRc", "KRav", "H"];
		var allValues = [];

		for(var i=0; i<allWells.length; i++)
			for(var j=0; j<attributesToConsider.length; j++)
				allValues.push(allWells[i][attributesToConsider[j]]);

		allValues.sort();

		return [allValues[0], allValues[allValues.length - 1]];
	 }

	 InfoGraph.prototype.getMinMaxValuesFromAttribute = function(wells, attribute) {
		var values = [];
		for(var i=0; i<wells.length; i++)
			values.push(wells[i][attribute]);
		values.sort();

		return [values[0], values[values.length - 1]];
	 }

	 // Normalize values that Shawn wrote.

	 /*
	  * TODO: Add comment!
	  */
	 InfoGraph.prototype.generateChart = function () {

		 $(function() {
			 $('#highchart-basic').highcharts({

				 chart: {
					 type: 'arearange',
					 zoomType: 'x'
				 },

				 title: {
					 text: undefined//'Temperature variation by day'
				 },

				 xAxis: {
					 categories: ['PHIc', 'PHIR', 'Vshc', 'Soc', 'KRc', 'KRav', 'H']
				 },

				 yAxis: {
					 title: {
						 text: undefined
					 },
					 labels: {
						 enabled: false
					 }
				 },

				 plotOptions: {
					 columnrange: {
						 dataLabels: {
							 inside: true,
							 enabled: true,
							 useHTML: true,
							 formatter: function() {
								 var html;

								 if(this.y === this.point.low) {
									 var paddingLow = (this.point.plotLow - this.point.plotHigh) - 18;

									 html = '<div style="color:black;height:' + (this.point.plotHigh - this.point.plotLow) + 'px;padding:' + paddingLow + 'px 0px 0px 0px">';
									 html += this.point.low;
									 html += '</div>';
									 return html;

								 } else if(this.y === this.point.high) {
									 var paddingHigh = (this.point.plotHigh - this.point.plotLow);

									 html = '<div style="color:black;height:' + (this.point.plotLow - this.point.plotHigh) + 'px;padding: '+ paddingHigh +'px 0px 0px 0px">';
									 html += this.point.high;
									 html += '</div>';
									 return html;

									 return this.point.high;
								 }
							 }
						 }
					 },
					 arearange: {
						 dataLabels: {
							 formatter: function() {

								 // PUT THE RIGHT NUMBERS FOR THE MAXIMUM AND MINIMUM!
								 if(this.y === this.point.low) {
									 console.log("Low: " + index % 7);
									 return minimums[index++ % 7];
								 }
								 else {
									 console.log("High: " + index % 7);
									 return maximums[index++ % 7];
								 }


							 }
						 }
					 },
					 series: {
						 dataLabels: {
							 enabled: true,
							 style: {
								 fontWeight:'bold'
							 }
						 }
					 }
				 },

				 tooltip: {
					 formatter: function() {
						 return false;
					 }
				 },

				 legend: {
					 enabled: false
				 },

				 series: [
					 {
						 name: 'MinMaxValues',
						 data: [[-10,35],[-10,35],[-10,35],[-10,35],[-10,35],[-10,35],[-10,35]],
						 color: "#F0F0F0"
					 },
					 {
						 type: 'columnrange',
						 // We want a vertical chart
						 inverted: false,

						 name: 'WellAttributes',
						 // The important part here would be grabing the max and min values from the wells
						 data: [
							 [-9.7, 9.4],
							 [-8.7, 6.5],
							 [-3.5, 9.4],
							 [-1.4, 19.9],
							 [0.0, 22.6],
							 [2.9, 29.5],
							 [9.2, 30.7]
						 ]
					 }
				 ]

			 });
		 });
	 }
	 generateChart();


	(typeof exports !== "undefined" && exports !== null ? exports : window).InfoGraph = InfoGraph;
 }).call(this);