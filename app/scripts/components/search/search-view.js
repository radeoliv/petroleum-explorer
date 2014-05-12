/*--------------------------------------------------------------------------------
 Author: robinbesson

 petroleum-explorer

 =============================================================================
 Filename: searchView.js
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/
var SearchView;
SearchView = function (searchController, mapCanvasController, graphSelection){//, tableController) {
	//TODO: create constructor for searchview
	this.searchController = searchController;
	this.mapCanvasController = mapCanvasController;
	this.graphSelection = graphSelection;
	//this.tableController = tableController;
};

var optionAccordion;	//global var for handling accordion option for search select
var optionStatus;	//global var for handling accordion option for search select
var isEventListenerActive = true;

(function () {
	$(function () {
		var active;
		active = function () {
			return $("#accordion").on("click", function () {
				optionAccordion = $("#accordion").accordion( "option", "active" );
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
				//console.log(optionStatus);
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
			forceNumeric([lsdSearchInput, sectionSearchInput, townshipSearchInput, rangeSearchInput, meridianSearchInput]);

			var uwiQuery=uwiSearchInput[0].value,
				lsdQuery=lsdSearchInput[0].value,
				sectionQuery=sectionSearchInput[0].value,
				townshipQuery=townshipSearchInput[0].value,
				rangeQuery=rangeSearchInput[0].value,
				meridianQuery=meridianSearchInput[0].value,
				companyQuery=companySearchInput[0].value;

			var results;
			var error = false;

			// Clears all fields
			isEventListenerActive = false;
			clearFields();

			switch(optionAccordion) {
				// Search by the entire UWI
				case 0:
					// Set again the original input
					uwiSearchInput[0].value = uwiQuery;

					if(checkUWIInput(uwiQuery))
						results = self.searchController.findResultsUWI(uwiQuery);
					else {
						if(uwiQuery.length == 0)
							// If the query is empty, there is nothing to be searched.
							results = null;
						else
							error = true;
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

					if(checkUWIValueInputs([lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery]))
						results = self.searchController.findResultsUWIValues(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery);
					else {
						if(lsdQuery.length == 0 && sectionQuery.length == 0 && townshipQuery.length == 0 && rangeQuery.length == 0 && meridianQuery.length == 0)
							// If the query is empty, there is nothing to be searched.
							results = null;
						else
							error = true;
					}
					break;
				// Search by the company name
				case 2:
					// Set again the original input
					companySearchInput[0].value = companyQuery;

					if(checkCompanyInput(companyQuery))
						results = self.searchController.findResultsCompany(companyQuery);
					else {
						if(companyQuery.length == 0)
							// If the query is empty, there is nothing to be searched.
							results = null;
						else
							error = true;
					}
					break;
				default:
					console.log("Accordion error!");
					break;
			}

			isEventListenerActive = true;
			displayResults(error, results);
			//this.tableController.displayTable();
		}
	});

	statusSearchInput.change( function (e) {
		if(isEventListenerActive) {
			var statusQuery = statusSearchInput[0].value;

			var results = null;
			var error = false;
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

					if(tempOptionStatus != "none")
						results = self.searchController.findResultsStatus(statusQuery);
					else
						// If the selection is none, there is nothing to be searched.
						results = null;

					break;
				default:
					console.log("Accordion error!");
					break;
			}

			// Set again the original input
			//statusSearchInput[0].value = tempOptionStatus;

			isEventListenerActive = true;
			displayResults(error, results);
		}
	});

	function displayResults(errorOccurred, results) {
		if(!errorOccurred) {
			// Cleaning the results area
			if($('#results-table') != undefined) {
				$('#results-table').remove();
			}

			//plot results on google maps
			self.mapCanvasController = new MapCanvasController().plotResults(results);
			self.graphSelection.setCurrentData(results);

			if(results != null) {
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
				// All the wells should be in the result set for the full table to show everything
				self.searchController.resetResultSet();
			}
			$("body").trigger("ResultsUpdated");
		} else {
			// Cleaning the results area
			if($('#results-table') != undefined) {
				$('#results-table').remove();
			}
		}
	}

	function forceNumeric(fields) {
		// Replacing non numeric characters with empty string for UWI value search
		for(var i=0; i<fields.length; i++) {
			fields[i].val(fields[i][0].value.replace(/\D/g, ''));
		}
	}

	function clearFields() {
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
					clearFields();
					statusSearchInput.change();
				});
			};
			clearSearch();
		});
	}).call(this);

	(typeof exports !== "undefined" && exports !== null ? exports : window).SearchView = SearchView;
};