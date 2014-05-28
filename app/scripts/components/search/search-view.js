/*--------------------------------------------------------------------------------
 Author: robinbesson

 petroleum-explorer

 =============================================================================
 Filename: searchView.js
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/
var SearchView;
SearchView = function (searchController, mapCanvasController){//, tableController) {
	//TODO: create constructor for searchview
	this.searchController = searchController;
	this.mapCanvasController = mapCanvasController;
	//this.tableController = tableController;
	lastResultSet = this.searchController.getAllWells();
};

var optionAccordion;	//global var for handling accordion option for search select
var optionStatus;	//global var for handling accordion option for search select
var isEventListenerActive = true;
var lastResultSet;
var wasTheSameResultSet = false;

var noQuery = "";
var lastUWIQuery = noQuery;
var lastLsdQuery = noQuery;
var lastSectionQuery = noQuery;
var lastTownshipQuery = noQuery;
var lastRangeQuery = noQuery;
var lastMeridianQuery = noQuery;
var lastCompanyQuery = noQuery;

(function () {
	$(function () {
		var active;
		active = function () {
			return $("#accordion").on("click", function () {
				optionAccordion = $("#accordion").accordion( "option", "active" );
				removeAllErrorAndAlertMessages();
			});
		};
		active();
	});
}).call(this);

(function () {
	$(function () {
		var active;
		active = function () {
			return $("#status").on("change", function () {
				optionStatus = $("#status").val();
			});
		};
		active();
	});
}).call(this);

/**
 * listen to key down events
 * send query to the searchController
 * @param $searchInputSelector jquery selector likely input[type="search"]
 * @param $searchInputForm housing form of search input
 */
SearchView.prototype.listenKeyboard = function ($searchInputSelector, $searchInputForm) {
	//var $resultsArea = $('<ul class="results"></ul>').appendTo($searchInputForm); //append the results container if javascript enabled

	var uwiSearchInput = $searchInputForm.find("input[name='uwi']"),
		lsdSearchInput = $searchInputForm.find("input[name='lsd']"),
		sectionSearchInput = $searchInputForm.find("input[name='section']"),
		townshipSearchInput = $searchInputForm.find("input[name='township']"),
		rangeSearchInput = $searchInputForm.find("input[name='range']"),
		meridianSearchInput = $searchInputForm.find("input[name='meridian']"),
		companySearchInput = $searchInputForm.find("input[name='company']"),
		statusSearchInput = $searchInputForm.find("select[name='status']");

	var self = this;

	$searchInputSelector.on("keyup", function (e) { //retrieving the value in the input and saving it as a string variable.  Whenever a search input has typed in it, performs the search
		if(isEventListenerActive) {
			removeAllErrorAndAlertMessages();
			forceNumeric([lsdSearchInput, sectionSearchInput, townshipSearchInput, rangeSearchInput, meridianSearchInput]);
			removeInitialWhiteSpace(companySearchInput);

			var uwiQuery = uwiSearchInput[0].value,
				lsdQuery = lsdSearchInput[0].value,
				sectionQuery = sectionSearchInput[0].value,
				townshipQuery = townshipSearchInput[0].value,
				rangeQuery = rangeSearchInput[0].value,
				meridianQuery = meridianSearchInput[0].value,
				companyQuery = companySearchInput[0].value;

			var results;
			var areTheSame = false;

			// Clears all fields
			isEventListenerActive = false;
			clearFields();

			switch(optionAccordion) {
				// Search by the entire UWI
				case 0:
					// Set again the original input
					uwiSearchInput[0].value = uwiQuery;

					if(uwiQuery === lastUWIQuery) {
						// If they are the same, do nothing
						areTheSame = true;
					} else {
						// However, if they are different, proceed the search
						lastUWIQuery = uwiQuery;

						if(checkUWIInput(uwiQuery)) {
							results = self.searchController.findResultsUWI(uwiQuery);
						} else {
							// If the query is empty or incomplete, there is nothing to be searched.
							results = null;
						}
					}

					break;
				// Search by the UWI values
				case 1:
					// Set again the original inputs
					lsdSearchInput[0].value = lsdQuery;
					sectionSearchInput[0].value = sectionQuery;
					townshipSearchInput[0].value = townshipQuery;
					rangeSearchInput[0].value = rangeQuery;
					meridianSearchInput[0].value = meridianQuery;

					if(lsdQuery === lastLsdQuery && sectionQuery === lastSectionQuery && townshipQuery === lastTownshipQuery
						&& rangeQuery === lastRangeQuery && meridianQuery === lastMeridianQuery) {
						// If they are the same, do nothing
						areTheSame = true;
					} else {
						// However, if they are different, proceed the search
						lastLsdQuery = lsdQuery, lastSectionQuery = sectionQuery, lastTownshipQuery = townshipQuery,
							lastRangeQuery = rangeQuery, lastMeridianQuery = meridianQuery;

						var fieldValues = [lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery];

						// Checking for correct query length and range
						if(checkUWIValueInputs(fieldValues)) {
							results = self.searchController.findResultsUWIValues(fieldValues);
						} else {
							if(checkEmptyUWIInputs(fieldValues) === true) {
								results = null;
							} else if(checkUWIInputsCompleteness(fieldValues) === false) {
								// If the queries are not complete, there is nothing to be searched.
								results = [];
							} else {
								results = [];
							}
						}
					}
					break;
				// Search by the company name
				case 2:
					// Set again the original input
					companySearchInput[0].value = companyQuery;

					if(checkCompanyInput(companyQuery)) {
						results = self.searchController.findResultsCompany(companyQuery);
					} else {
						// If the query is empty, there is nothing to be searched.
						results = null;
					}
					break;
				default:
					console.log("Accordion error!");
					break;
			}

			isEventListenerActive = true;
			if(!areTheSame) {
				displayResults(results);
			}
		}
	});

	statusSearchInput.change( function (e) {
		if(isEventListenerActive) {
			removeAllErrorAndAlertMessages();
			var statusQuery = statusSearchInput[0].value;

			var results = null;
			switch(optionAccordion) {
				case 0:
				case 1:
				case 2:
					break;
				case 3:
					var tempOptionStatus = optionStatus;

					// Clears all fields
					isEventListenerActive = false;
					clearFields();
					statusSearchInput[0].value = statusQuery;

					if(tempOptionStatus != "none") {
						results = self.searchController.findResultsStatus(statusQuery);
					} else {
						// If the selection is none, there is nothing to be searched.
						results = null;
					}
					break;
				default:
					console.log("Accordion error!");
					break;
			}

			isEventListenerActive = true;
			displayResults(results);
		}
	});

	function displayResults(results) {
		// Cleaning the results area
		if($('#results-table') != undefined) {
			$('#results-table').remove();
		}

		if(results != null) {
			if(results.length > 0) {
				//append the results container if javascript enabled
				var $resultsArea = $('<div id="results-table" class="handsontable"></div>').appendTo($searchInputForm);
				var data = [];

				for (var i=0;i<results.length;i++) {
					data.push([results[i]["Well_Unique_Identifier_Simplified_Format"], results[i]["Well_Operator"], results[i]["Well_Status"]]);
				}

				$('#results-table').handsontable({
					data: data,
					colHeaders: ["UWI", "Company", "Status"],
					colWidths: [150, 500, 100],
					overflow: scroll,
					readOnly: true,
					columnSorting: true,
					currentRowClassName: 'currentRow',
					height: function(){
						if (results.length < 10){
							return ($("#htCore").height());
						}
						else
							return 250;
					}
				});
			} else {
				self.searchController.emptyResultSet();
			}
		} else {
			// All the wells should be in the result set for the full table to show everything
			self.searchController.resetResultSet();
		}

		// The comparison with 'stringify' can only be used because the order of the elements does not change!!!
		// Be careful when using it around to compare JSONs...
		var sameLength = lastResultSet.length === self.searchController.getResultSet().length;
		if(!sameLength || JSON.stringify(lastResultSet) != JSON.stringify(self.searchController.getResultSet())) {
			// Update the last result set
			lastResultSet = self.searchController.getResultSet();
			// Plot results on map
			self.mapCanvasController.plotResults(results);
			$("body").trigger("ResultsUpdated");
		}
	}

	function forceNumeric(fields) {
		// Replacing non numeric characters with empty string for UWI value search
		for(var i=0; i<fields.length; i++) {
			fields[i].val(fields[i][0].value.replace(/\D/g, ''));
		}
	}

	function removeInitialWhiteSpace(field) {
		if(field != undefined && field != null && field.length > 0 && field[0].value != undefined && field[0].value != null) {
			field.val(field[0].value.replace(/ /g, ''));
		}
	}

	function checkIfFieldsAreEmpty() {
		var result = $searchInputForm.find("input[name='uwi']").val() === ""
			&& $searchInputForm.find("input[name='lsd']").val() === ""
			&&$searchInputForm.find("input[name='section']").val() === ""
			&&$searchInputForm.find("input[name='township']").val() === ""
			&&$searchInputForm.find("input[name='range']").val() === ""
			&&$searchInputForm.find("input[name='meridian']").val() === ""
			&&$searchInputForm.find("input[name='company']").val() === ""
			&&$searchInputForm.find("select[name='status']").val() === 'none';

		return result;
	}

	function clearFields() {
		checkIfFieldsAreEmpty();
		$searchInputForm.find("input[name='uwi']").val(''),
		$searchInputForm.find("input[name='lsd']").val(''),
		$searchInputForm.find("input[name='section']").val(''),
		$searchInputForm.find("input[name='township']").val(''),
		$searchInputForm.find("input[name='range']").val(''),
		$searchInputForm.find("input[name='meridian']").val(''),
		$searchInputForm.find("input[name='company']").val(''),
		$searchInputForm.find("select[name='status']").val('none');
	}

	/*
	 * This function is called to clear all the search fields that the user might have filled.
	 */
	(function () {
		$(function () {
			function clearSearch() {
				return $("#clear-search").on("click", function () {
					if(checkIfFieldsAreEmpty() === false) {
						clearFields();
						statusSearchInput.change();
					}
				});
			};
			clearSearch();
		});
	}).call(this);

	(typeof exports !== "undefined" && exports !== null ? exports : window).SearchView = SearchView;
};