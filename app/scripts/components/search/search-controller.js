/*--------------------------------------------------------------------------------
 Author: ad3sh

 petroleum-explorer

 =============================================================================
 Filename: search-controller.js
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/

/*
 * Static error messages
 */
var requiredErrorMsg = "<b>TWP</b>, <b>RNG</b> or <b>MER</b> must be completely filled.",
	lsdErrorMsg = "<b>LSD</b> value must be within 01 and 16.",
	sectionErrorMsg = "<b>SEC</b> value must be within 01 and 36.",
	townshipErrorMsg = "<b>TWP</b> value must be within 001 and 126.",
	rangeErrorMsg = "<b>RNG</b> value must be within 01 and 34.",
	meridianErrorMsg = "<b>MER</b> value must be within 1 and 6.",
	UWIAlertMsg = "The <b>UWI</b> must be completely filled.";

(function() {
	var resultNotSetBySearch = false;

	var SearchController;
	SearchController = (function() {
		/**
		 * constructor for the search controller
		 * @param dataSet object with two fields, UWID(string) and
		 * @param searchQuery
		 * @param resultSet
		 * @constructor
		 */
		function SearchController(dataSet,resultSet) {
			this.dataSet = dataSet;
			this.resultSet = dataSet;
			if(this.resultSet === null || typeof(this.resultSet) === "undefined"){
				this.resultSet = [];
			}
			this.NULL_ERROR_MESSAGE = "Could not find data, as it was null";
			this.UNDEFINED_ERROR_MESSAGE = "undefined search query";
			this.EMPTY_RESULTSET_ERROR_MESSAGE = "0 results found";
			this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE = "search query is empty";
			this.NULL_QUERY_ERROR_MESSAGE = "search query is null";
		}

		/*
		 * Retrieve resultNotSetBySearch variable, indicating if the result was not set by the search operation
		 */
		SearchController.prototype.isResultNotSetBySearch = function() {
			return resultNotSetBySearch;
		};

		function setResultNotSetBySearch(isNotBySearch) {
			resultNotSetBySearch = isNotBySearch;
			$("body").trigger("resultSetChanged");

			if(isNotBySearch === true) {
				$("#clear-search").trigger("click");
			}
		}

		/*
		 * Used to keep the data consistent
		 */
		SearchController.prototype.resetResultSet = function() {
			this.resultSet = this.dataSet;
		};

		/*
		 * Sets a new value to the result set
		 */
		SearchController.prototype.setResultSet = function(result) {
			this.resultSet = result;
		}

		/*
		 * The result set is defined by the given ids
		 */
		SearchController.prototype.setResultSetByIds = function(wellIds) {
			if(wellIds != undefined && wellIds != null && wellIds.length > 0) {
				this.resetResultSet();
				var auxLength = this.resultSet.length;
				var temp = [];

				for(var i=0; i<auxLength; i++) {
					if($.inArray(this.resultSet[i]["Well_Unique_Identifier"], wellIds) >= 0) {
						temp.push(this.resultSet[i]);
					}

					// There is nothing to look for..
					if(temp.length === wellIds.length) {
						break;
					}
				}
				this.resultSet = temp;
				setResultNotSetBySearch(true);
			}
		};

		/*
		 * The result set is defined by the inverse of the given ids
		 */
		SearchController.prototype.setResultSetByIdsInverse = function(currentWells, wellIds) {
			if(currentWells != undefined && currentWells != null && currentWells.length > 0 &&
				wellIds != undefined && wellIds != null && wellIds.length > 0) {

				var countRemoved = 0;

				for(var i=0; i<currentWells.length; i++) {
					// If the id matches, remove the value from the result set
					if($.inArray(currentWells[i]["Well_Unique_Identifier"], wellIds) >= 0) {
						currentWells.splice(i--, 1);
						countRemoved++;
					}

					// There is nothing to look for..
					if(countRemoved === wellIds.length) {
						break;
					}
				}

				this.resultSet = currentWells;
				setResultNotSetBySearch(true);
			}
		};

		/*
		 * Used to keep the data consistent
		 */
		SearchController.prototype.emptyResultSet = function() {
			this.resultSet = [];
		};

		/*
		 * Returns the result set
		 */
		SearchController.prototype.getResultSet = function() {
			return this.resultSet;
		};

		/**
		 * find the UWID matching the search criteria (LSD, range, township, section, meridian)
		 * @param query the search query we will use to search through UWI
		 * @returns {string}
		 */
		SearchController.prototype.findResultsUWIValues = function(fieldValues) {

			var lsdQuery = fieldValues[0],
				sectionQuery = fieldValues[1],
				townshipQuery = fieldValues[2],
				rangeQuery = fieldValues[3],
				meridianQuery = fieldValues[4];

			//TODO: parse JSON file (wells.json)
			// check if any values are empty
			// for each search input with a valid entry, check contents of corresponding JSON data in this.dataset using && for each
			// return objects that match
			if(this.dataSet === null){
				return this.NULL_ERROR_MESSAGE;
			}

			this.resultSet = [];

			var queryArray=[lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery];

			for(var i = 0; i < queryArray.length; i++) {
				if(queryArray[i] === null) {
					return this.NULL_QUERY_ERROR_MESSAGE;
				}
				else if(typeof(queryArray[i]) === "undefined") {
					return this.UNDEFINED_ERROR_MESSAGE;
				}
				/*else if(this.isEmptyQuery(query)){
				 queryArray.pop(query);
				 //return this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE;
				 }*/
			}

			for(var i=0; i<this.dataSet.length;i++) {
				/*
				 * Search by UWI values
				 */
				var uwi = this.dataSet[i]['Well_Unique_Identifier_Simplified_Format'];

				if(!this.isEmptyQuery(townshipQuery) && townshipQuery != getTownship(uwi))
					continue;

				if(!this.isEmptyQuery(rangeQuery) && rangeQuery != getRange(uwi))
					continue;

				if(!this.isEmptyQuery(meridianQuery) && meridianQuery != getMeridian(uwi))
					continue;

				if(!this.isEmptyQuery(lsdQuery) && lsdQuery != getLSD(uwi))
					continue;

				if(!this.isEmptyQuery(sectionQuery) && sectionQuery != getSection(uwi))
					continue;

				this.resultSet.push(this.dataSet[i]);
			}

			setResultNotSetBySearch(false);
			return this.resultSet;
		};


		/**
		 * find the wells matching the search criteria (status)
		 * @param query the search query we will use to search through UWID
		 * @returns {string}
		 */
		SearchController.prototype.findResultsUWI = function(uwiQuery) {
			// check if any values are empty
			// for each search input with a valid entry, check contents of corresponding JSON data in this.dataset using && for each
			// return objects that match
			if(this.dataSet === null){
				return this.NULL_ERROR_MESSAGE;
			}

			this.resultSet = [];

			if(uwiQuery === null){
				return this.NULL_QUERY_ERROR_MESSAGE;
			}
			else if(typeof(uwiQuery) === "undefined"){
				return this.UNDEFINED_ERROR_MESSAGE;
			}
			else if(this.isEmptyQuery(uwiQuery)){
				return this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE;
			}

			for(var i=0; i<this.dataSet.length;i++) {
				/*
				 * Search by entire UWI
				 */
				if(!this.isEmptyQuery(uwiQuery)) {
					// TODO: Change the JSON attribute when the new json file is created
					var cMatch = this.dataSet[i]['Well_Unique_Identifier_Simplified_Format'].toUpperCase().search(uwiQuery.toUpperCase());

					if(cMatch >= 0)
						this.resultSet.push(this.dataSet[i]);
				}
			}

			setResultNotSetBySearch(false);
			return this.resultSet;
		};


		/**
		 * find the wells matching the search criteria (company)
		 * @param query the search query we will use to search through UWID
		 * @returns {string}
		 */
		SearchController.prototype.findResultsCompany = function(companyQuery) {
			// check if any values are empty
			// for each search input with a valid entry, check contents of corresponding JSON data in this.dataset using && for each
			// return objects that match
			if(this.dataSet === null){
				return this.NULL_ERROR_MESSAGE;
			}

			this.resultSet = [];

			if(companyQuery === null){
				return this.NULL_QUERY_ERROR_MESSAGE;
			}
			else if(typeof(companyQuery) === "undefined"){
				return this.UNDEFINED_ERROR_MESSAGE;
			}
			else if(this.isEmptyQuery(companyQuery)) {
				return this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE;
			}

			for(var i=0; i<this.dataSet.length;i++) {
				/*
				 * Search by company name
				 */
				if(!this.isEmptyQuery(companyQuery)) {
					var cMatch = this.dataSet[i]['Well_Operator'].toUpperCase().search(companyQuery.toUpperCase());
					if(cMatch >= 0)
						this.resultSet.push(this.dataSet[i]);
				}
			}

			setResultNotSetBySearch(false);
			return this.resultSet;
		};

		/**
		 * find the wells matching the search criteria (status)
		 * @param query the search query we will use to search through UWID
		 * @returns {string}
		 */
		SearchController.prototype.findResultsStatus = function(statusQuery) {
			// check if any values are empty
			// for each search input with a valid entry, check contents of corresponding JSON data in this.dataset using && for each
			// return objects that match
			if(this.dataSet === null){
				return this.NULL_ERROR_MESSAGE;
			}

			this.resultSet = [];

			if(statusQuery === null){
				return this.NULL_QUERY_ERROR_MESSAGE;
			}
			else if(typeof(statusQuery) === "undefined"){
				return this.UNDEFINED_ERROR_MESSAGE;
			}
			else if(this.isEmptyQuery(statusQuery)){
				return this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE;
			}

			for(var i=0; i<this.dataSet.length;i++) {
				/*
				 * Search by status name
				 */
				if(!this.isEmptyQuery(statusQuery)) {
					// TODO: Change the JSON attribute when the new json file is created
					var cMatch = this.dataSet[i]['Well_Status'].toUpperCase().search(statusQuery.toUpperCase());

					if(cMatch >= 0)
						this.resultSet.push(this.dataSet[i]);
				}
			}

			setResultNotSetBySearch(false);
			return this.resultSet;
		};

		/**
		 * return all wells present in the system
		 * @returns {string}
		 */
		SearchController.prototype.getAllWells = function() {
			return this.dataSet;
		};


		/**
		 * function retrieving the json file containing the data and sending the result to the attribute dataset of the searchController
		 * @returns {exports|*}
		 */
		SearchController.prototype.getMockData = function(){
			this.dataSet = require("../../../../test/mocks/uniqueWellIdentifierDataTest.json");
			return this.dataSet;
		};

		/**
		 * Checks search query for excessive spaces or unaccepted formats.  Returns true if any of formats match.
		 * @param searchQuery
		 */
		SearchController.prototype.isEmptyQuery = function(searchQuery) {
			return (searchQuery).trim() === "";
		};

		return SearchController;

	})();

	(typeof exports !== "undefined" && exports !== null ? exports : window).SearchController = SearchController;

}).call(this);

function getLSD(uwi) {
	return uwi.substr(3,2);
}

function getSection(uwi) {
	return uwi.substr(5,2);
}

function getTownship(uwi) {
	return uwi.substr(7,3);
}

function getRange(uwi) {
	return uwi.substr(10,2);
}

function getMeridian(uwi) {
	return uwi.substr(13,1);
}

function checkUWIInput(uwiFieldValue) {
	$(".alert-msg").remove();
	var divToAppend = '.search-form';
	var result = uwiFieldValue.length === 16;

	if(result === false) {
		$(createAlertMessage(UWIAlertMsg)).appendTo(divToAppend);
	}

	return result;
}

function checkEmptyUWIInputs(fieldValues) {
	var lsd = fieldValues[0],
		section = fieldValues[1],
		township = fieldValues[2],
		range = fieldValues[3],
		meridian = fieldValues[4];

	var result = lsd.length === 0 && section.length === 0 && township.length === 0 && range.length === 0 && meridian.length === 0;

	return result;
}

function checkUWIInputsCompleteness(fieldValues) {
	var lsd = fieldValues[0],
		section = fieldValues[1],
		township = fieldValues[2],
		range = fieldValues[3],
		meridian = fieldValues[4];

	var result = lsd.length === 2
		|| section.length === 2
		|| township.length === 3
		|| range.length === 2
		|| meridian.length === 1;

	return result;
}

function checkUWIValueInputs(fieldValues) {
	// Checking UWI inputs for appropriate length and range of values
	// Values in fieldValues are in-order (lsd, section, township, range, meridian)

	// Township, Range and Meridian are mandatory fields.
	// If any one of these three fields is filled properly, the search should be executed.

	$( ".error-msg" ).remove();
	var lsd = fieldValues[0],
		section = fieldValues[1],
		township = fieldValues[2],
		range = fieldValues[3],
		meridian = fieldValues[4];

	var divToAppend = '.search-form';

	var validity = true;
	var mandatoryField = false;
	var appendMandatoryFieldError = false;

	/*
	 * Township
	 */
	if(township.length === 3) {
		if(!(township >= 1 && township <= 126)) {
			$(createErrorMessage(townshipErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			mandatoryField = true;
		}
	} else if(township.length > 0) {
		validity = false;
	}

	/*
	 * Range
	 */
	if(range.length === 2) {
		if(!(range >= 1 && range <= 34)) {
			$(createErrorMessage(rangeErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			mandatoryField = true;
		}
	} else if(range.length > 0) {
		validity = false;
	}

	/*
	 * Meridian
	 */
	if(meridian.length === 1) {
		if(!(meridian >= 1 && meridian <= 6)) {
			$(createErrorMessage(meridianErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			mandatoryField = true;
		}
	} else if(meridian.length > 0) {
		validity = false;
	}

	/*
	 * LSD
	 */
	if(lsd.length === 2) {
		if(!(lsd >= 1 && lsd <= 16)) {
			$(createErrorMessage(lsdErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			if(appendMandatoryFieldError === false && mandatoryField === false) {
				appendMandatoryFieldError = true;
			}
		}
	} else if(lsd.length > 0) {
		validity = false;
	}

	/*
	 * Section
	 */
	if(section.length === 2) {
		if(!(section >= 1 && section <= 36)) {
			$(createErrorMessage(sectionErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			if(appendMandatoryFieldError === false && mandatoryField === false) {
				appendMandatoryFieldError = true;
			}
		}
	} else if(section.length > 0) {
		validity = false;
	}

	if(appendMandatoryFieldError === true) {
		$(createErrorMessage(requiredErrorMsg)).appendTo(divToAppend);
	}

	return validity && mandatoryField;
}

function removeAllErrorAndAlertMessages() {
	$(".error-msg").remove();
	$(".alert-msg").remove();
}

function checkCompanyInput(companyFieldValue) {
	return companyFieldValue.length > 0;
}

function createErrorMessage(message) {
	return '<label class = "error-msg">'+message+'</br></label>';
}

function createAlertMessage(message) {
	return '<label class = "alert-msg">'+message+'</br></label>';
}