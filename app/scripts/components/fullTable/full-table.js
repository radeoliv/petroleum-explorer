// Generated by CoffeeScript 1.7.1
(function () {
	var FullTable;

	function populateColumnFilter(tableColumns, html) {
		for (var i = 0;
			i < tableColumns.length;
			i++) {
			html += '<option>' + i + tableColumns[i].sTitle + '</option>';
		}
		var $columnSelect = this.$columnFilter.find("#tableColumnFilter").append(html);
	}

	function addNumberConstraint() {
		var constraintSelectTypeString = $('<select><option value="matches">Matches</option><option value="contains">Contains</option></select>').appendTo($(this).parent());
	}

	function addStringConstraint() {
		var constraintSelectTypeNumber = $('<select><option value="gt">Is Greater Than</option><option value="lt">Is Less Than</option><option value="eq">Is Equal To</option></select>').appendTo($(this).parent());
	}

	function cloneAndAppend() {
		$(this).clone().appendTo($(this).parent());
	}

	/**
	 * @class FullTable
	 * @param SearchController with search results
	 * @param $tableContainer {*|jQuery} object for placeholder for table data
	 */
	FullTable = (function () {
		function FullTable(SearchController, $fullTableResultsContainer) {
			this.SearchController = SearchController;
			this.$fullTableResultsContainer = $fullTableResultsContainer;
			this.$tableContainer = $fullTableResultsContainer.find(".full-results-table");

			this.$contentContainer = $fullTableResultsContainer.find(".full-table-content");
			this.$columnFilter = this.$contentContainer.find(".filter-form");
			this.toggleButton = $fullTableResultsContainer.find(".toggle-table");

			this.displayHandsOnTable();
			this.listenChanges();
			this.listenToggle();
			this.$contentContainer.dialog("close");
		}

		FullTable.prototype.displayHandsOnTable = function() {

			console.log("Just called DisplayHandsOnTable Full");

			this.$tableContainer.remove();

			var data;

			if(typeof(this.SearchController) != "undefined"){

				console.log("undefined search controller check passed");

				if (this.SearchController.resultSet.length > 0) {

					console.log("search res > 0 passed");

					data = this.SearchController.resultSet;

					console.log(this.SearchController);

					//plot results on google maps
					//self.mapCanvasController = new MapCanvasController().plotResults(data);

					this.$tableContainer = $('<div id="results-table" class="handsontable"></div>').appendTo(this.$contentContainer);

					this.$tableContainer.handsontable({
						data: data,
						colHeaders: ["Name", "Full UWI", "Status", "Province", "Primary Formation", "Well Pool Name", "Company", "Well Drillers Total Depth", "Well Class", "Cumulative Shale Content", "UWI", "Oil Saturation", "Effective Life Cycle", "Peak Value", "Effective Yield", "Cumulative Porosity", "Cumulative Pore Volume", "Cumulative Hydrocarbon Movability", "Average Hydrocarbon Movability", "Thickness"],

						width: 300,
						height: 300,
						readOnly: true,
						columnSorting: true,
						currentRowClassName: 'currentRow'

					});
					this.toggleButton.addClass("active");
					this.$contentContainer.dialog({
						title: 'Show results',
						draggable: true,
						resizable: true,
						modal : true,
						width: 500,
						height: 500
					});
					this.initColumnFilter();
					console.dir(this.SearchController.resultSet);
				}
			}
		}


		/**
		 * Toggle table update on `ResultsUpdated` event
		 * @returns {*|jQuery}
		 */
		FullTable.prototype.listenChanges = function () {
			console.log('change occured');
			return $("body").on("ResultsUpdated", (function (_this) {
				return function () {
					return _this.displayHandsOnTable();
				};
			})(this));
		};


		/**
		 * Add individual option elements for each column in full table
		 */
		FullTable.prototype.initColumnFilter = function () {
			if (this.$columnFilter.length > 0) {

				//populateColumnFilter.call(this, tableColumns, html);
				var $columnSelectFilter = this.$columnFilter.find("#tableColumnFilter");

			 	// if the selector works...
				var tableColumns = this.$tableContainer.handsontable("getColHeader"),
									html, $columnSelectFilter,
									$addConstraintButton = this.$columnFilter.find(".add-constraint");


				// Check when the select element is changed, and NOT the default is selected, then add constraint filter
				$columnSelectFilter.on("change", function() {
				switch($(this).val()) { // the current selected <option>
					case "0":
						console.log('hello');
						break;
					case "Well_Operator":
					case "Well_Pool_Name":
					case "Well_Primary_Producing_Formation":
					case "Well_Province":
					case "Well_Status":
					case "Well_Unique_Identifier":
					case "Well_Name":
						cloneAndAppend.call(this);
						addStringConstraint.call(this);
						// Enable button
						$addConstraintButton.attr({
							title: "Add New String Constraint"
						}).removeAttr("disabled").on("click", function() {
							addStringConstraint.call(this);
							return false;
						});
						break;
					default: // Numeric
						// find the values in the SearchResults array
						cloneAndAppend.call(this);
						addNumberConstraint.call(this);
						$addConstraintButton.attr({
							title: "Add New Number Constraint"
						}).removeAttr("disabled").on("click", function() {
							addNumberConstraint.call(this);
							return false;
						});
					}
				});
			}
		}

		/**
		 * Toggle full table data when clicking the button
		 * @returns {*}
		 */
		FullTable.prototype.listenToggle = function () {
			return this.toggleButton.on("click", (function (_this) {
				return function () {
					$(this).toggleClass("active");
					if ($(this).hasClass("active")) {
						return _this.$contentContainer.dialog("close");
					}
					else {
						return _this.$contentContainer.dialog("open");
					}
				};
			})(this));
		};

		return FullTable;

	})();

	(typeof exports !== "undefined" && exports !== null ? exports : window).FullTable = FullTable;

}).call(this);
