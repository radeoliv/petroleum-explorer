 /*--------------------------------------------------------------------------------
	Author: Rodrigo Silva
	github: https://github.com/srsgores/

	seng515-petroleum-explorer

	=============================================================================
	Filename: info-graph.js
	=============================================================================
	This file is responsible to generate the default chart (oil production).
-------------------------------------------------------------------------------*/

 (function () {

	 var InfoGraph;
	 var index = 0;
	 var dataSet;
	 var currentWells;

	 InfoGraph = (function(){
		 function InfoGraph(){
		 }
	 });

	 var self = this;

	 InfoGraph.prototype.generateChart = function(currentUWI, allCurrentWells, allDataSet) {

		 $(function() {
			 var currentIndex = [];
			 dataSet = allDataSet;
			 currentWells = allCurrentWells;

			 for(var i=0; i<dataSet.length; i++)
			 {
				 if(dataSet[i]["Well_Unique_Identifier"] === currentUWI)
				 {
					 currentIndex.push(i);
					 break;
				 }
			 }

			 var minMax = getMinMaxValuesFromAllAttributes(dataSet);
			 var minMaxValues =
				 [
					 [minMax[0],minMax[1]],
					 [minMax[0],minMax[1]],
					 [minMax[0],minMax[1]],
					 [minMax[0],minMax[1]],
					 [minMax[0],minMax[1]],
					 [minMax[0],minMax[1]],
					 [minMax[0],minMax[1]]
				 ];

			 /*
			  * Values from all the wells
			  */
			 var PHIcAllValues = getValuesFromProperty(dataSet, "PHIc");
			 var PHIRAllValues = getValuesFromProperty(dataSet, "PHIR");
			 var VshcAllValues = getValuesFromProperty(dataSet, "Vshc");
			 var SocAllValues = getValuesFromProperty(dataSet, "Soc");
			 var KRcAllValues = getValuesFromProperty(dataSet, "KRc");
			 var KRavAllValues = getValuesFromProperty(dataSet, "KRav");
			 var HAllValues = getValuesFromProperty(dataSet, "H");

			 /*
			  * Values from the wells being shown on the map
			  */
			 var PHIcValues = getValuesFromProperty(currentWells, "PHIc");
			 var PHIRValues = getValuesFromProperty(currentWells, "PHIR");
			 var VshcValues = getValuesFromProperty(currentWells, "Vshc");
			 var SocValues = getValuesFromProperty(currentWells, "Soc");
			 var KRcValues = getValuesFromProperty(currentWells, "KRc");
			 var KRavValues = getValuesFromProperty(currentWells, "KRav");
			 var HValues = getValuesFromProperty(currentWells, "H");

			 /*
			  * Values from the current selected well
			  */
			 var PHIcCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([PHIcAllValues[currentIndex]], 1)[0];
			 var PHIRCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([PHIRAllValues[currentIndex]], 1)[0];
			 var VshcCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([VshcAllValues[currentIndex]], 1)[0];
			 var SocCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([SocAllValues[currentIndex]], 1)[0];
			 var KRcCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([KRcAllValues[currentIndex]], 1)[0];
			 var KRavCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([KRavAllValues[currentIndex]], 1)[0];
			 var HCurrentSelectedWellValue = useDefinedNumberOfDecimalPlaces([HAllValues[currentIndex]], 1)[0];

			 var currentSelectedWellValues =
				 [{
					 "PHIc": PHIcCurrentSelectedWellValue,
					 "PHIR": PHIRCurrentSelectedWellValue,
					 "Vshc": VshcCurrentSelectedWellValue,
					 "Soc": SocCurrentSelectedWellValue,
					 "KRc": KRcCurrentSelectedWellValue,
					 "KRav": KRavCurrentSelectedWellValue,
					 "H": HCurrentSelectedWellValue
				 }];

			 /*
			  * Indices of the wells being shown on the map in the 'all wells' set
			  */
			 var PHIcIndices = getValuesIndices(PHIcAllValues, PHIcValues);
			 var PHIRIndices = getValuesIndices(PHIRAllValues, PHIRValues);
			 var VshcIndices = getValuesIndices(VshcAllValues, VshcValues);
			 var SocIndices = getValuesIndices(SocAllValues, SocValues);
			 var KRcIndices = getValuesIndices(KRcAllValues, KRcValues);
			 var KRavIndices = getValuesIndices(KRavAllValues, KRavValues);
			 var HIndices = getValuesIndices(HAllValues, HValues);

			 /*
			  * Normalized value of all wells
			  */
			 var normalizedPHIcAllValues = normalize_data(PHIcAllValues, minMax[0], minMax[1]);
			 var normalizedPHIRAllValues = normalize_data(PHIRAllValues, minMax[0], minMax[1]);
			 var normalizedVshcAllValues = normalize_data(VshcAllValues, minMax[0], minMax[1]);
			 var normalizedSocAllValues = normalize_data(SocAllValues, minMax[0], minMax[1]);
			 var normalizedKRcAllValues = normalize_data(KRcAllValues, minMax[0], minMax[1]);
			 var normalizedKRavAllValues = normalize_data(KRavAllValues, minMax[0], minMax[1]);
			 var normalizedHAllValues = normalize_data(HAllValues, minMax[0], minMax[1]);

			 /*
			  * Normalized values of wells being shown on the map
			  */
			 var normalizedPHIcValues = getValuesFromIndices(normalizedPHIcAllValues, PHIcIndices);
			 var normalizedPHIRValues = getValuesFromIndices(normalizedPHIRAllValues, PHIRIndices);
			 var normalizedVshcValues = getValuesFromIndices(normalizedVshcAllValues, VshcIndices);
			 var normalizedSocValues = getValuesFromIndices(normalizedSocAllValues, SocIndices);
			 var normalizedKRcValues = getValuesFromIndices(normalizedKRcAllValues, KRcIndices);
			 var normalizedKRavValues = getValuesFromIndices(normalizedKRavAllValues, KRavIndices);
			 var normalizedHValues = getValuesFromIndices(normalizedHAllValues, HIndices);

			 /*
			  * Normalized values of the current selected well
			  */
			 var normalizedCurrentPHIcValue = getValuesFromIndices(normalizedPHIcAllValues, currentIndex);
			 var normalizedCurrentPHIRValue = getValuesFromIndices(normalizedPHIRAllValues, currentIndex);
			 var normalizedCurrentVshcValue = getValuesFromIndices(normalizedVshcAllValues, currentIndex);
			 var normalizedCurrentSocValue = getValuesFromIndices(normalizedSocAllValues, currentIndex);
			 var normalizedCurrentKRcValue = getValuesFromIndices(normalizedKRcAllValues, currentIndex);
			 var normalizedCurrentKRavValue = getValuesFromIndices(normalizedKRavAllValues, currentIndex);
			 var normalizedCurrentHValue = getValuesFromIndices(normalizedHAllValues, currentIndex);

			 /*
			  * Set with the normalized values of the current selected well
			  */
			 var normalizedCurrentValues =
				 [
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentPHIcValue, 1)[0],
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentPHIRValue, 1)[0],
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentVshcValue, 1)[0],
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentSocValue, 1)[0],
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentKRcValue, 1)[0],
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentKRavValue, 1)[0],
					 useDefinedNumberOfDecimalPlaces(normalizedCurrentHValue, 1)[0]
				 ];

			 var minMaxNormalizedData =
				 [
					 getMinMaxValues(normalizedPHIcValues),
					 getMinMaxValues(normalizedPHIRValues),
					 getMinMaxValues(normalizedVshcValues),
					 getMinMaxValues(normalizedSocValues),
					 getMinMaxValues(normalizedKRcValues),
					 getMinMaxValues(normalizedKRavValues),
					 getMinMaxValues(normalizedHValues)
				 ];

			 var minMaxActualData =
				 [
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(PHIcValues), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(PHIRValues), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(VshcValues), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(SocValues), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(KRcValues), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(KRavValues), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(HValues), 1)
				 ];

			 var minMaxTotalData =
				 [
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "PHIc")), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "PHIR")), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "Vshc")), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "Soc")), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "KRc")), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "KRav")), 1),
					 useDefinedNumberOfDecimalPlaces(getMinMaxValues(getValuesFromProperty(dataSet, "H")), 1)
				 ];

			 $('#highchart-basic').highcharts({

				 chart: {
					 type: 'arearange',
					 zoomType: 'x'
				 },

				 title: {
					 text: undefined
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

									 html = '<div style="color:white;height:' + (this.point.plotHigh - this.point.plotLow) + 'px;padding:' + paddingLow + 'px 0px 0px 0px">';
									 html += minMaxActualData[this.point.x][0];
									 html += '</div>';
									 return html;

								 } else if(this.y === this.point.high) {
									 var paddingHigh = (this.point.plotHigh - this.point.plotLow);

									 html = '<div style="color:white;height:' + (this.point.plotLow - this.point.plotHigh) + 'px;padding: '+ paddingHigh +'px 0px 0px 0px">';
									 html += minMaxActualData[this.point.x][1];
									 html += '</div>';
									 return html;
								 }
							 }
						 }
					 },
					 arearange: {
						 dataLabels: {
							 formatter: function() {
								 if(this.y === this.point.low) {
									 return minMaxTotalData[index++ % 7][0];
								 }
								 else {
									 return minMaxTotalData[index++ % 7][1];
								 }
							 }
						 }
					 },
					 scatter: {
						 dataLabels: {
							 formatter: function() {
								 // The scatter should not have labels to indicate values!
								 return '';
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
						 if(this.series != undefined)
						 {
							 if(this.series.name === "actualValue")
							 {
								 return "<b>" + this.key + " current value</b><br>" + currentSelectedWellValues[0][this.key];
							 }
							 else if(this.series.name === "wellAttributes")
							 {
								 var content = "<b>" + this.key + " range</b><br>"
									 + minMaxActualData[this.point.x][0] + " - " + minMaxActualData[this.point.x][1] + "<br>"
									 + "<b>Current value</b><br>" + currentSelectedWellValues[0][this.key];
								 return content;
							 }
							 else
							 // to disable the tooltip at a point return false
								 return false;
						 }
					 }
				 },

				 legend: {
					 enabled: false
				 },

				 series: [
					 {
						 name: 'minMaxValues',
						 data: minMaxValues,
						 color: "#D0D0D0",
						 states: {
							 hover: false
						 },
						 zIndex: 1
					 },
					 {
						 type: 'columnrange',
						 // We want a vertical chart
						 inverted: false,

						 name: 'wellAttributes',
						 // The important part here would be grabbing the max and min values from the wells
						 data: minMaxNormalizedData,
						 states: {
							 hover: false
						 },
						 zIndex: 2,
						 colorByPoint: true
					 },
					 {
						 type: 'scatter',
						 name: 'actualValue',
						 data: normalizedCurrentValues,
						 marker: {
							 fillColor: 'red',
							 lineWidth: 3,
							 lineColor: 'black'
						 },
						 zIndex: 3
					 }
				 ]
			 });
		 });
	 };

	 function getMinMaxValues(allWells) {
		 var attributesToConsider = ["PHIc", "PHIR", "Vshc", "Soc", "KRc", "KRav", "H"];
		 var allValues = [];

		 for(var i=0; i<allWells.length; i++)
			 for(var j=0; j<attributesToConsider.length; j++)
				 allValues.push(allWells[i][attributesToConsider[j]]);

		 allValues.sort();

		 return [allValues[0], allValues[allValues.length - 1]];
	 }

	 function getMinMaxValuesFromAttribute(wells, attribute) {
		 var values = [];
		 for(var i=0; i<wells.length; i++)
			 values.push(wells[i][attribute]);
		 values.sort();

		 return [values[0], values[values.length - 1]];
	 }

	 function getMinMaxValuesFromAllAttributes(allWells) {
		 var attributesToConsider = ["PHIc", "PHIR", "Vshc", "Soc", "KRc", "KRav", "H"];

		 var max = -999999999, min = 999999999;

		 for(var i=0; i<allWells.length; i++)
		 {
			 for(var j=0; j<attributesToConsider.length; j++)
			 {
				 if(allWells[i][attributesToConsider[j]] > max)
					 max = allWells[i][attributesToConsider[j]];
				 if(allWells[i][attributesToConsider[j]] < min)
					 min = allWells[i][attributesToConsider[j]];
			 }
		 }

		 return [min, max];
	 }

	 function getMinMaxValues(values) {
		 var max = -999999999, min = 999999999;
		 for(var i=0; i<values.length; i++)
		 {
			 if(values[i] > max)
				 max = values[i];
			 if(values[i] < min)
				 min = values[i];
		 }

		 return [min, max];
	 }

	 function getValuesFromProperty(wells, attribute) {
		 var result = [];

		 for(var i=0; i<wells.length; i++)
			 result.push(wells[i][attribute]);

		 return result;
	 }

	 function useDefinedNumberOfDecimalPlaces(values, decimalPlaces) {
		 if(decimalPlaces < 0)
			 return null;

		 var result = [];

		 for(var i=0; i<values.length; i++)
			 result.push(parseFloat(values[i].toFixed(decimalPlaces)));

		 return result;
	 }

	 /*
	  * TODO: USE SHAWN'S NORMALIZATION TO DO IT!
	  */
	 function normalize_data (values, lowVal, highVal) {
		 var N = values.length;

		 //Get the minimum and maximum values:
		 var minMax = getMinMaxValues(values);
		 var min = minMax[0];
		 var max = minMax[1];
		 var range = max - min;
		 var range2 = highVal - lowVal;

		 var data_out = [];
		 //If min=max, then return an array with all values set to (low_val + high_val)/2
		 if (min === max)
			 for (var i = 0; i < N; i++)
				 data_out[i] = (lowVal + highVal) / 2;
		 else //If min != max, then the data can be scaled by the factor (high_val-low_val)/(max-min) without dividing by 0.
			 for (var i = 0; i < N; i++)
			 {
				 data_out[i] = (values[i] - min) / range;
				 data_out[i] = (data_out[i] * range2) + lowVal;
			 }

		 return data_out;
	 }

	 function getValuesIndices(totalSet, subSet) {
		 var indices = [];

		 for(var i=0; i<subSet.length; i++)
		 {
			 indices.push(totalSet.indexOf(subSet[i]));
		 }

		 return indices;
	 }

	 function getValuesFromIndices(totalSet, indices) {
		 var result = [];

		 for(var i=0; i<indices.length; i++)
			 result.push(totalSet[indices[i]]);

		 return result;
	 }

	(typeof exports !== "undefined" && exports !== null ? exports : window).InfoGraph = InfoGraph;
 }).call(this);