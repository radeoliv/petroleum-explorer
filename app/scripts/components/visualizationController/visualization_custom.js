/*--------------------------------------------------------------------------------
 Author: mandy

 =============================================================================
 Filename:
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/
/**
 *
 * @param $container
 * @param chartType [pieChart, barChart]
 * @param data [Array] search results object array
 * @constructor
 */
var Visualization_custom = function ($container, data, dataQuery, chartType) {

	this.$container = $container;
	this.data = data;
	this.dataQuery = dataQuery;
	this.filterdata = this.filterResults(data,dataQuery);
	switch (chartType){
		case 'pieChart':
			this.chartType = 'pie';
			break;
		default:
			this.chartType = 'column';
			break;

	}
	this.renderVisualization();

};

Visualization_custom.prototype.renderVisualization = function () {

	if (this.data.length < 1) {
		return;
	}

	return this.$container.highcharts({
		chart:       {
			type: this.chartType
		},
		title: {
			text: 'Petroleum Data'
		},
		subtitle:	{
			text: ''
		},
		xAxis:       {
			//categories:
		},
		yAxis:       {
			min:   0,
			title: {
				text: this.dataQuery
			}
		},
		tooltip:     {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat:  '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
			footerFormat: '</table>',
			shared:       true,
			useHTML:      true
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth:  0
			}
		},
		series:      [
			{
				name: this.dataQuery,
				data: this.filterdata
			}
		]
	});
};

Visualization_custom.prototype.filterResults = function(dataset, dataQuery)
{
	var result = [];
	for (var i =0; i<dataset.length; i++)
	{
		result.push(dataset[i].dataQuery);

	}

	return result;
};



	(typeof exports !== "undefined" && exports !== null ? exports : window).Visualization_custom = Visualization_custom;
