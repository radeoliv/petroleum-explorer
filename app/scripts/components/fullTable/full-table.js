/*--------------------------------------------------------------------------------
 Author: Rodrigo Silva

 petroleum-explorer

 =============================================================================
 Filename: full-table.js
 =============================================================================
 Contains all the logic to create, display, update and format data in a table (handsontable).
 -------------------------------------------------------------------------------*/

(function () {
	var FullTable;
	var self;

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
			self = this;
			this.MapController = MapCanvasController;
			this.SearchController = SearchController;
			this.$tableContainer = $fullTableResultsContainer.find(".full-results-table");
			this.$contentContainer = $fullTableResultsContainer.find(".full-table-content");
			this.$columnFilter = this.$contentContainer.find(".filter-form");
			this.toggleButton = $fullTableResultsContainer.find(".toggle-table");

			this.initSearchResults = this.SearchController.resultSet;

			this.displayHandsOnTable();
			this.listenChanges();
			this.filterChanges();
			this.listenToggle();
			this.initColumnFilter();
			this.listenForInput(this.$columnFilter);
			this.listenParameterRemoved(this.$columnFilter);
			this.findFilterQuery([]);
			closeDialog(this, false);
		}

		/*
		 * Function to open the content container dialog with or without fade in.
		 * A verification on the toggle button is done, in order to keep the consistency.
		 */
		function openDialog(_this, withFadeIn) {
			if (_this.toggleButton.hasClass("active") === false) {
				_this.toggleButton.toggleClass("active");
			}

			if(withFadeIn == true) {
				return _this.$contentContainer.dialog("open", _this.$contentContainer.fadeIn());
			} else {
				return _this.$contentContainer.dialog("open");
			}
		}

		/*
		 * Function to close the content container dialog with or without fade out.
		 * A verification on the toggle button is done, in order to keep the consistency.
		 */
		function closeDialog(_this, withFadeOut) {
			if (_this.toggleButton.hasClass("active") === true) {
				_this.toggleButton.toggleClass("active");
			}

			if(withFadeOut == true) {
				return _this.$contentContainer.dialog("close", _this.$contentContainer.fadeOut());
			} else {
				return _this.$contentContainer.dialog("close");
			}
		}

		/*
		 * Indicates which data belongs to each column, the type of it and some other properties.
		 * Returns all the columns for the handsontable API.
		 */
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
						//simple text, no special options
					},
					{
						data: "UWISimplifiedFormat"
						//simple text, no special options
					},
					{
						data: "Longitude"
						//number, but precision is important in coordinates
					},
					{
						data: "Latitude"
						//number, but precision is important in coordinates
					},
					{
						data: "WellName"
						//simple text, no special options
					},
					{
						data: "WellDrillersTotalDepth",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "WellOperator"
						//simple text, no special options
					},
					{
						data: "WellStatus"
						//simple text, no special options
					},
					{
						data: "WellProvince"
						//simple text, no special options
					},
					{
						data: "WellClass"
						//simple text, no special options
					},
					{
						data: "WellPrimaryProducingFormation"
						//simple text, no special options
					},
					{
						data: "WellPoolName"
						//simple text, no special options
					},
					{
						data: "CumulativePorosity",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "CumulativePoreVolume",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "CumulativeShaleContent",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "CumulativeOilSaturation",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "CumulativeHydrocarbonMovability",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "AverageHydrocarbonMovability",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "Thickness",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "EffectiveYield",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "PeakValue",
						type: "numeric",
						format: "0.000"
					},
					{
						data: "EffectiveLifeCycle",
						type: "numeric",
						format: "0.000"
					}
				];

			return columns;
		}

		/*
		 * Returns all the headers name on the table
		 */
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

		/*
		 * Returns a list with all the values that are significant to be displayed on the table
		 */
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
			this.$columnFilter.on("keyup", (function (e) {
				return function () {
					getAndFilterQueries();
				}
			})(this));

			this.$columnFilter.children().on("change", function (e){
				if(e.target.getAttribute("name") != "tableColumnFilter"){
					$("body").trigger("filterParameterRemoved");
				}
			});
		};

		FullTable.prototype.listenParameterRemoved = function ($columnFilter) {
			return $("body").on("filterParameterRemoved", (function (_this) {
				return function () {
					getAndFilterQueries();
				};
			})(this));
		};

		/*
		 * Goes through all defined filters, generate the filter query and filter results.
		 */
		function getAndFilterQueries() {
			var filterQueryArray = [];
			var filterParameters = self.$columnFilter.find(".filterParameter");
			for(var i = 0; i < filterParameters.length; i++){

				var labelValue = filterParameters.find("label")[i].getAttribute("value");
				var constraintValue = filterParameters.find("select")[i].value;
				var inputValue = filterParameters.find("input")[i].value;

				filterQueryArray.push([labelValue, constraintValue, inputValue]);
			}

			self.findFilterQuery(filterQueryArray);
		}

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
			this.MapController.plotResults(filterResultSet);
			$("body").trigger("FilterUpdated");
		};

		FullTable.prototype.displayHandsOnTable = function() {
			var _this = this;
			this.$tableContainer.remove();

			if(typeof(this.SearchController) != "undefined") {
				if (this.initSearchResults.length > 0) {
					var searchResults = this.initSearchResults;
					var self = this;
					var data = getSignificantAttributesData(searchResults);
					var columns = getColumns();
					var columnsHeaders = getColumnHeaders();

					// The checkbox was added inside the table div to allow customization of style and event
					this.$tableContainer = $(
						'<div id="full-results-table" class="handsontable">' +
							'<input type=\"checkbox\" id=\"checkAll\"/>' +
							'</div>').appendTo(this.$contentContainer);

					// Definition of the table itself
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

					this.$tableContainer.handsontable('getInstance').addHook('afterChange', function() {
						updateSelectedRows(this, false, self);
					});

					this.$tableContainer.on('mouseup', '#checkAll', function (event) {
						var isChecked = !$(this).is(':checked');
						checkAll(isChecked, self.$tableContainer.handsontable('getInstance'));
					});

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

					this.$contentContainer.dialog({
						title: 'Detailed Results',
						draggable: true,
						resizable: true,
						modal : true,
						autoOpen: true,
						width: width,
						height: height
					});

					// If the user selected some rows before, they need to be kept as selected after the table is updated.
					updateSelectedRows(this.$tableContainer.handsontable('getInstance'), true, self);
				}
			}
		};

		/*
		 * Checks or unchecks all the rows in the table
		 */
		function checkAll(isChecked, instance) {
			var rows = instance.countRows();
			var changes = [];
			// Storing all changes in array to do a bulk change
			for(var row=0; row<rows; row++) {
				changes.push([row, 0, isChecked]);
			}
			instance.setDataAtCell(changes);
		}

		/*
		 * Function responsible to update the map with the selected rows
		 */
		function updateSelectedRows(instance, isTableUpdated, ref) {
			var allData = instance.getData();
			var currentlySelectedRows = [];

			for(var i=0; i<allData.length; i++) {
				// If the row was selected before, it must keep selected now.
				if(isTableUpdated && $.inArray(allData[i]["UWI"], ref.selectedRows) >= 0) {
					allData[i]["Selected"] = true;
				}

				if(allData[i]["Selected"] === true) {
					// The UWI should be enough to identify the selected wells
					// The string below must be the same as in the table (UWI, not the full name)
					currentlySelectedRows.push(allData[i]["UWI"]);
				}
			}

			ref.selectedRows = currentlySelectedRows;

			if(ref.MapController != undefined && ref.MapController != null) {
				ref.MapController.highlightWells(ref.selectedRows);
			}
		}

		/*
		 * Returns the values in the table
		 */
		FullTable.prototype.getCurrentTableData = function() {
			return this.$tableContainer.handsontable('getInstance').getData();
		};

		/*
		 * Toggles selection of the row that matches the UWI of the element
		 */
		FullTable.prototype.toggleRowsSelection = function(element) {
			var table = this.$tableContainer.handsontable('getInstance');
			// The wells are identified by the UWI
			var index = $.inArray(element, table.getDataAtProp("UWI"));
			if(index >= 0) {
				var isSelected = table.getDataAtRowProp(index, "Selected");
				table.setDataAtRowProp(index, "Selected", !isSelected);
			}
		};

		/*
		 * Returns the column headers as presented in the table
		 */
		FullTable.prototype.getCurrentTableHeaders = function() {
			return this.$tableContainer.handsontable('getInstance').getColHeader();
		};

		/**
		 * Toggle table update on 'ResultsUpdated' event
		 * @returns {*|jQuery}
		 */
		FullTable.prototype.listenChanges = function () {
			return $("body").on("ResultsUpdated", (function (_this) {
				return function () {
					_this.initSearchResults = _this.SearchController.resultSet;
					getAndFilterQueries();
					_this.displayHandsOnTable();

					closeDialog(_this, false);
				};
			})(this));
		};

		FullTable.prototype.filterChanges = function () {
			return $("body").on("FilterUpdated", (function (_this) {
				return function () {
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
					if ($(this).hasClass("active")) {
						$(this).toggleClass("active");
						$('#results-table').slideToggle();
						// The other search fields are disabled (still don't know what is causing that)
						document.getElementById("status").disabled = false;
						return closeDialog(_this, true);
					}
					else {
						$(this).toggleClass("active");
						$('#results-table').slideToggle();
						// The other search fields are disabled (still don't know what is causing that)
						document.getElementById("status").disabled = true;
						return openDialog(_this, true);
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