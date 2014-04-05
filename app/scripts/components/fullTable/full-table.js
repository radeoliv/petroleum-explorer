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
			this.displayTable();
			this.listenChanges();
			this.toggleButton = $fullTableResultsContainer.find(".toggle-table").attr({
				"disabled": "disabled",
				"title": "Please specify coordinates to view data"
			});
			this.listenToggle();


		}

		/**
		 * Display all search results in table container using datatables
		 * @returns {*}
		 */
		FullTable.prototype.displayTable = function () {
			var data;
			//console.log("Call to display table");
			//console.dir(this.SearchController.resultSet);
			// Check if datatable has already been initialized.  If it is, then exit to avoid error
			if (this.$tableContainer.hasClass(".dataTable") === true) {
				return;
			}
			if(typeof(this.SearchController) != "undefined"){
				if (this.SearchController.resultSet.length > 0) {
					data = this.SearchController.resultSet;
					var table = this.$tableContainer.dataTable({
						data:    data,
						//bRetrieve for the popup window showing an error doesn"t always appear (not sure how it solves the problem though)
						bRetrieve: true,
						"dom": 'C<"clear">lfrtip',
						"oColVis": {
							"activate": "mouseover"
						},
						columns: [
							{
								data: "H",
								title: "Thickness"
							},
							{
								data: "KRav",
								title: "Average Hydrocarbon Movability"
							},
							{
								data: "KRc",
								title: "Cumulative Hydrocarbon Movability"
							},
							{
								data: "PHIR",
								title: "Cumulative Pore Volume"
							},
							{
								data: "PHIc",
								title: "Cumulative Porosity"
							},
							{
								data: "Pc",
								title: "Effective Yield"
							},
							{
								data: "Pp",
								title: "Peak Value"
							},
							{
								data: "Pt",
								title: "Effective Life Cycle"
							},
							{
								data: "Soc",
								title: "Oil Saturation"
							},
							{
								data: "Well_Unique_Identifier_Simplified_Format",
								title: "UWI"
							},
							{
								data: "Vshc",
								title: "Cumulative Shale Content"
							},
							{
								data: "Well_Class",
								title: "Well Class"
							},
							{
								data: "Well_Drillers_Total_Depth",
								title: "Well Drillers Total Depth"
							},
							{
								data: "Well_Operator",
								title: "Company"
							},
							{
								data: "Well_Pool_Name",
								title: "Well Pool Name"
							},
							{
								data: "Well_Primary_Producing_Formation",
								title: "Primary Formation"
							},
							{
								data: "Well_Province",
								title: "Province"
							},
							{
								data: "Well_Status",
								title: "Status"
							},
							{
								data: "Well_Unique_Identifier",
								title: "Full UWI"
							},
							{
								data: "Well_Name",
								title: "Name"
							}
						]
					});
					table.fnDraw(true); // TODO: Fix table not updating
					this.toggleButton.removeAttr("disabled").attr("title", "Toggle Full Table View").addClass("active");
					this.$contentContainer.dialog({
						title: 'Show results',
						draggable: true,
						resizable: true,
						height: 600,
						width: 750
					});
					this.initColumnFilter();
					// For debugging
					console.log("Attempting to create datatable with data");
					console.dir(this.SearchController.resultSet);
				}
			}
		};

		/**
		 * Add individual option elements for each column in full table
		 */
		FullTable.prototype.initColumnFilter = function () {
			if (this.$columnFilter.length > 0) { // if the selector works...
				var tableColumns = this.$tableContainer.dataTable().api().columns(),
					html,
					$columnSelectFilter,
					$addConstraintButton = this.$columnFilter.find(".add-constraint");
				//populateColumnFilter.call(this, tableColumns, html);
				var $columnSelectFilter = this.$columnFilter.find("#tableColumnFilter");
				// Check when the select element is changed, and NOT the default is selected, then add constraint filter
				$columnSelectFilter.on("change", function() {
					switch($(this).val()) { // the current selected <option>
						case "0":
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
								title: "Add New String Constraint",
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
								title: "Add New Number Constraint",
							}).removeAttr("disabled").on("click", function() {
								addNumberConstraint.call(this);
								return false;
							});
					}
				});
			}
		}

		/**
		 * Toggle table update on `ResultsUpdated` event
		 * @returns {*|jQuery}
		 */
		FullTable.prototype.listenChanges = function () {
			return $("body").on("ResultsUpdated", (function (_this) {
				return function () {
					return _this.displayTable();
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
