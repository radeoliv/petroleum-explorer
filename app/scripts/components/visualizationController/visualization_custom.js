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

(function () {

	var Visualization_custom;

	Visualization_custom = (function () {
		function Visualization_custom() {
		}

		Visualization_custom.prototype.renderVisualization = function ($container, data, dataQuery, chartType) {

			this.$containerDiv = $container.selector;
			this.data = data;
			this.dataQuery = dataQuery;
			this.filterdata = this.filterResults(data, dataQuery);
			switch (chartType){
				case 'pie':
					this.chartType = 'pie';
					break;
				default:
					this.chartType = 'column';
					break;

			}

			console.log(this.$containerDiv, this.dataQuery, this.filterdata, this.chartType)

			if (this.data.length < 1) {
				return;
			}

			$('#highchart-basic').highcharts({
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
				result.push(dataset[i][dataQuery]);
			}

			return result;
		};

		return Visualization_custom;

	})();

	(typeof exports !== "undefined" && exports !== null ? exports : window).Visualization_custom = Visualization_custom;
}).call(this);