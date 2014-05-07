
(function () {
	var FullTable;

	function populateColumnFilter(tableColumns, html) {
		for (var i = 0; i < tableColumns.length; i++) {
			html += '<option>' + i + tableColumns[i].sTitle + '</option>';
		}
		var $columnSelect = this.$columnFilter.find("#tableColumnFilter").append(html);
	}

	function addParameterOption(index, type) {
		var labelForFilter = '<label value="'+$(this)[0].value+'">'+$(this).find("option:selected").text()+'</label></br>';

		var removeFilterOption = '<div id="'+index+'" class="filterBtnParent"><button type="button" class="filterButton minusButton"><i class="icon-minus"></i></button></div>';

		var constraintSelectType;
		if(type == "String") {
			constraintSelectType = '<select id="'+index+'" class="filterConstraintField"><option value="matches">Matches</option><option value="contains">Contains</option></select></br>';
		}
		else if(type == "Number") {
			constraintSelectType = '<select id="'+index+'" class="filterConstraintField"><option value="gt">Is Greater Than</option><option value="lt">Is Less Than</option><option value="eq">Is Equal To</option></select></br>';
		}

		var inputField = '<input id="'+index+'" class="filterInputField"><hr>';

		$('<div id="'+index+'" class="filterParameter">'+removeFilterOption+labelForFilter+constraintSelectType+inputField+'</div>').appendTo($(this).parent());

		var $removeFilterButton = $("#" + index).find(".filterBtnParent");
		$removeFilterButton.on("click", function() {
			$removeFilterButton.parent().remove();
			$("body").trigger("filterParameterRemoved");
		});
	}

	/**
	 * @class FullTable
	 * @param SearchController with search results
	 * @param $tableContainer {*|jQuery} object for placeholder for table data
	 */
	FullTable = (function () {
		function FullTable(SearchController, MapCanvasController, $fullTableResultsContainer) {
			this.MapController = MapCanvasController;
			this.SearchController = SearchController;
			this.$tableContainer = $fullTableResultsContainer.find(".full-results-table");
			this.$contentContainer = $fullTableResultsContainer.find(".full-table-content");
			this.$columnFilter = this.$contentContainer.find(".filter-form");
			this.toggleButton = $fullTableResultsContainer.find(".toggle-table");

			this.initSearchResults = this.SearchController.resultSet

			this.displayHandsOnTable(this.initSearchResults);
			this.listenChanges();
			this.filterChanges();
			this.listenToggle();
			this.initColumnFilter();
			this.listenForInput(this.$columnFilter);
			this.listenParameterRemoved(this.$columnFilter);
			this.findFilterQuery([]);
			this.$contentContainer.dialog("close");
		}

		function getColumns() {
			var columns =
				[
					{
						data: "Selected",
						type: "checkbox",
						readOnly: false
					},
					{
						data: "UWI"
					},
					{
						data: "UWISimplifiedFormat"
					},
					{
						data: "Longitude"
					},
					{
						data: "Latitude"
					},
					{
						data: "WellName"
					},
					{
						data: "WellDrillersTotalDepth"
					},
					{
						data: "WellOperator"
					},
					{
						data: "WellStatus"
					},
					{
						data: "WellProvince"
					},
					{
						data: "WellClass"
					},
					{
						data: "WellPrimaryProducingFormation"
					},
					{
						data: "WellPoolName"
					},
					{
						data: "CumulativePorosity"
					},
					{
						data: "CumulativePoreVolume"
					},
					{
						data: "CumulativeShaleContent"
					},
					{
						data: "CumulativeOilSaturation"
					},
					{
						data: "CumulativeHydrocarbonMovability"
					},
					{
						data: "AverageHydrocarbonMovability"
					},
					{
						data: "Thickness"
					},
					{
						data: "EffectiveYield"
					},
					{
						data: "PeakValue"
					},
					{
						data: "EffectiveLifeCycle"
					}
				];

			return columns;
		}

		function getColumnHeaders() {
			var headers =
				[
					"",
					"UWI",
					"UWI Simplified Format",
					"Longitude",
					"Latitude",
					"Well Name",
					"Well Drillers Total Depth",
					"Well Operator",
					"Well Status",
					"Well Province",
					"Well Class",
					"Well Primary Producing Formation",
					"Well Pool Name",
					"Cumulative Porosity",
					"Cumulative Pore Volume",
					"Cumulative Shale Content",
					"Cumulative Oil Saturation",
					"Cumulative Hydrocarbon Movability",
					"Average Hydrocarbon Movability",
					"Thickness",
					"Effective Yield",
					"Peak Value",
					"Effective Life Cycle"
				];

			return headers;
		}

		function getSignificantAttributesData(searchResults) {
			var data = [];

			for(var i=0; i<searchResults.length ; i++){
				data.push(
					{
						Selected: false,
						UWI: searchResults[i]["Well_Unique_Identifier"],
						UWISimplifiedFormat: searchResults[i]["Well_Unique_Identifier_Simplified_Format"],
						Longitude: searchResults[i]["Longitude Decimal Degrees"],
						Latitude: searchResults[i]["Latitude Decimal Degrees"],
						WellName: searchResults[i]["Well_Name"],
						WellDrillersTotalDepth: searchResults[i]["Well_Drillers_Total_Depth"],
						WellOperator: searchResults[i]["Well_Operator"],
						WellStatus: searchResults[i]["Well_Status"],
						WellProvince: searchResults[i]["Well_Province"],
						WellClass: searchResults[i]["Well_Class"],
						WellPrimaryProducingFormation: searchResults[i]["Well_Primary_Producing_Formation"],
						WellPoolName: searchResults[i]["Well_Pool_Name"],
						CumulativePorosity: searchResults[i]["PHIc"],
						CumulativePoreVolume: searchResults[i]["PHIR"],
						CumulativeShaleContent:searchResults[i]["Vshc"],
						CumulativeOilSaturation: searchResults[i]["Soc"],
						CumulativeHydrocarbonMovability:searchResults[i]["KRc"],
						AverageHydrocarbonMovability: searchResults[i]["KRav"],
						Thickness: searchResults[i]["H"],
						EffectiveYield: searchResults[i]["Pc"],
						PeakValue: searchResults[i]["Pp"],
						EffectiveLifeCycle: searchResults[i]["Pt"]
					}
				);
			}

			return data;
		}

		FullTable.prototype.listenForInput = function($columnFilter) {

			var filterQueryArray = [];

			this.$columnFilter.on("keyup", (function (_this) {
				return function () {
					filterQueryArray = [];
					for(var i = 0; i < $columnFilter.find(".filterParameter").length; i++){

						var labelValue = $columnFilter.find(".filterParameter").find("label")[i].getAttribute("value");
						var constraintValue = $columnFilter.find(".filterParameter").find("select")[i].value;
						var inputValue = $columnFilter.find(".filterParameter").find("input")[i].value;

						filterQueryArray.push([labelValue, constraintValue, inputValue]);
					}

					_this.findFilterQuery(filterQueryArray);
				}

			})(this));

			this.$columnFilter.children().on("change", function (e){
				if(e.target.getAttribute("name") != "tableColumnFilter"){
					$("body").trigger("filterParameterRemoved");
				}
			});
		}

		FullTable.prototype.listenParameterRemoved = function ($columnFilter) {
			return $("body").on("filterParameterRemoved", (function (_this) {
				return function () {
					console.log("Filter removed - line 95ish");
					var filterQueryArray = [];
					for(var i = 0; i < $columnFilter.find(".filterParameter").length; i++){

						var labelValue = $columnFilter.find(".filterParameter").find("label")[i].getAttribute("value");
						var constraintValue = $columnFilter.find(".filterParameter").find("select")[i].value;
						var inputValue = $columnFilter.find(".filterParameter").find("input")[i].value;

						filterQueryArray.push([labelValue, constraintValue, inputValue]);
					}

					_this.findFilterQuery(filterQueryArray);
				};
			})(this));
		};

		FullTable.prototype.findFilterQuery = function(query) {

			var searchResultSet = this.SearchController.resultSet;
			var filterResultSet = [];

			for(var i=0; i<searchResultSet.length;i++) {
				var boolPush = true;

				for(var j = 0; j < query.length; j++) {
					if(query[j][2] != "") {

						switch(query[j][1]) {
							case "matches":
								if((searchResultSet[i][query[j][0]].toUpperCase()) != ((query[j][2]).toUpperCase())) {
									boolPush = false;
								}
								break;
							case "contains":
								if((searchResultSet[i][query[j][0]].toUpperCase()).search((query[j][2]).toUpperCase()) < 0) {
									boolPush = false;
								}
								break;
							case "gt":
								if(searchResultSet[i][query[j][0]] <= parseFloat(query[j][2])) {
									boolPush = false;
								}
								break;
							case "lt":
								if(searchResultSet[i][query[j][0]] >= parseFloat(query[j][2])) {
									boolPush = false;
								}
								break;
							case "eq":
								if(searchResultSet[i][query[j][0]] != parseFloat(query[j][2])) {
									boolPush = false;
								}
								break;
							default:
								break;
						}
					}
				}
				if(boolPush) {
					filterResultSet.push(searchResultSet[i]);
				}
			}

			this.initSearchResults = filterResultSet;
			$("body").trigger("FilterUpdated");
			this.MapController.plotResults(filterResultSet);
		}

		FullTable.prototype.displayHandsOnTable = function() {

			this.$tableContainer.remove();

			if(typeof(this.SearchController) != "undefined"){

				if (this.initSearchResults.length > 0) {
					var searchResults = this.initSearchResults;

					var data = getSignificantAttributesData(searchResults);
					var columns = getColumns();
					var columnsHeaders = getColumnHeaders();

					//plot results on google maps
					//self.mapCanvasController = new MapCanvasController().plotResults(data);

					this.$tableContainer = $('<div id="full-results-table" class="handsontable"></div>').appendTo(this.$contentContainer);

					this.$tableContainer.handsontable({
						data: data,
						colHeaders: columnsHeaders,
						columns: columns,
						width: function(){
							return ($(".full-table-content").width() - $(".filter-form").width() - 13);
						},
						height: function(){
							return ($(".full-table-content").height() - 13);
						},
						readOnly: true,
						columnSorting: true,
						currentRowClassName: 'currentRow',
						fixedColumnsLeft: 1
					});

					this.toggleButton.addClass("active");

					// Default initial values for width and height
					var width = 650;
					var height = 400;
					// The height and width of the dialog need to be the same as before
					if(this.$contentContainer != undefined && this.$contentContainer != null) {
						var tempDialog = this.$contentContainer.dialog();
						if(tempDialog != undefined && tempDialog != null && tempDialog.length == 1) {
							var tempFullTableDialog = tempDialog[0];
							var dialogWithHeaderOffset = tempFullTableDialog.offsetHeight + 46;

							if(dialogWithHeaderOffset > height) {
								height = dialogWithHeaderOffset;
							}
							if(tempFullTableDialog.offsetWidth > width) {
								width = tempFullTableDialog.offsetWidth;
							}
						}
					}

					console.log("atualizado!");

					this.$contentContainer.dialog({
						title: 'Detailed Results',
						draggable: true,
						resizable: true,
						modal : true,
						autoOpen: true,
						width: width,
						height: height
					});
				}
			}
		}

		/**
		 * Toggle table update on `ResultsUpdated` event
		 * @returns {*|jQuery}
		 */
		FullTable.prototype.listenChanges = function () {
			return $("body").on("ResultsUpdated", (function (_this) {
				return function () {
					console.log("Results updated - line 240ish");
					_this.initSearchResults = _this.SearchController.resultSet;
					_this.displayHandsOnTable();
					_this.$contentContainer.dialog("close");
				};
			})(this));
		};

		FullTable.prototype.filterChanges = function () {
			return $("body").on("FilterUpdated", (function (_this) {
				return function () {
					console.log("Filter updated - line 260ish");
					_this.displayHandsOnTable();
				};
			})(this));
		};


		/**
		 * Toggle full table data when clicking the button
		 * @returns {*}
		 */
		FullTable.prototype.listenToggle = function () {
			return this.toggleButton.on("click", (function (_this) {
				return function () {
					$(this).toggleClass("active");
					if ($(this).hasClass("active")) {
						$('#results-table').slideToggle();
						return _this.$contentContainer.dialog("close", _this.$contentContainer.fadeOut());
					}
					else {
						$('#results-table').slideToggle();
						return _this.$contentContainer.dialog("open", _this.$contentContainer.fadeIn());
					}
				};
			})(this));
		};

		/**
		 * Add individual option elements for each column in full table
		 */
		FullTable.prototype.initColumnFilter = function () {

			var i = 0;

			if (this.$columnFilter.length > 0) {
				//populateColumnFilter.call(this, tableColumns, html);
				var $columnSelectFilter = this.$columnFilter.find("#tableColumnFilter");
				var $addConstraintButton = this.$columnFilter.find("#add-constraint");

				// Check when the select element is changed, and NOT the default is selected, then add constraint filter
				$addConstraintButton.on("click", function() {
					switch($columnSelectFilter.val()) { // the current selected <option>
						case "0":
							break;
						// String Options
						case "Well_Operator":
						case "Well_Pool_Name":
						case "Well_Primary_Producing_Formation":
						case "Well_Province":
						case "Well_Status":
						case "Well_Unique_Identifier":
						case "Well_Unique_Identifier_Simplified_Format":
						case "Well_Class":
						case "Well_Name":
							i++;
							addParameterOption.call($columnSelectFilter, i, "String");
							break;
						default: // Numeric Options
							i++
							addParameterOption.call($columnSelectFilter, i, "Number");
							break;
					}

					// Resetting the selected value
					$columnSelectFilter.val(0);
				});
			}
		}

		return FullTable;

	})();

	(typeof exports !== "undefined" && exports !== null ? exports : window).FullTable = FullTable;

}).call(this);