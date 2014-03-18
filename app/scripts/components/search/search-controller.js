
 /*--------------------------------------------------------------------------------
	Author: ad3sh
	www: http://seangoresht.com/
	github: https://github.com/srsgores

	twitter: http://twitter.com/S.Goresht

	seng515-petroleum-explorer
	Do What the Fuck You Want License

	=============================================================================
	Filename: search-controller.js
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 /*
  * Static error messages
  */
 var lsdErrorMsg = "<b>LSD</b> value must be within 01 and 16.",
	 sectionErrorMsg = "<b>SEC</b> value must be within 01 and 36.",
	 townshipErrorMsg = "<b>TWP</b> value must be within 001 and 126.",
	 rangeErrorMsg = "<b>RNG</b> value must be within 01 and 34.",
	 meridianErrorMsg = "<b>MER</b> value must be within 1 and 6.";


 (function() {
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
			 console.dir(this.dataSet);//$.getJSON("../../../../test/mocks/uniqueWellIdentifierData.json", function() {
				 //alert("success");
			 //});

			 this.resultSet = resultSet;
			 if(this.resultSet === null || typeof(this.resultSet) === "undefined"){
				 this.resultSet = [];
			 }
			 this.NULL_ERROR_MESSAGE = "Could not find data, as it was null";
			 this.UNDEFINED_ERROR_MESSAGE = "undefined search query";
			 this.EMPTY_RESULTSET_ERROR_MESSAGE = "0 results found";
			 this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE = "search query is empty";
			 this.NULL_QUERY_ERROR_MESSAGE = "search query is null";
		 }

		 /**
		  * find the UWID matching the search criteria (LSD, range, township, section, meridian)
		  * @param query the search query we will use to search through UWID
		  * @returns {string}
		  */
		 SearchController.prototype.findResultsUWIValues = function(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery) {

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
				 if(queryArray[i] === null){
					 return this.NULL_QUERY_ERROR_MESSAGE;
				 }
				 else if(typeof(queryArray[i]) === "undefined"){
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
				var uwi = this.dataSet[i]['UWI'];

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

			// TODO: If the result set is empty -> search did not find anything. Is that supposed to be an error?!
			if(this.resultSet.length<1){
				return this.EMPTY_RESULTSET_ERROR_MESSAGE;
			}

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
					 var cMatch = this.dataSet[i]['UWI'].toUpperCase().search(uwiQuery.toUpperCase());

					 if(cMatch >= 0)
						 this.resultSet.push(this.dataSet[i]);
				 }
			 }

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
			else if(this.isEmptyQuery(companyQuery)){
				return this.EMPTY_SEARCH_QUERY_ERROR_MESSAGE;
			}

			for(var i=0; i<this.dataSet.length;i++) {
				/*
				 * Search by company name
				 */
				if(!this.isEmptyQuery(companyQuery)) {
					// TODO: Change the JSON attribute when the new json file is created
					var cMatch = this.dataSet[i]['Well_Opera'].toUpperCase().search(companyQuery.toUpperCase());

					if(cMatch >= 0)
						this.resultSet.push(this.dataSet[i]);
				}
			}

			return this.resultSet;
		};

//
//		 /*
//		  * Search by well status
//		  */
//		 if(!this.isEmptyQuery(statusQuery)) {
//			 var cMatch = this.dataSet[i]['Well_Statu'].toUpperCase().search(statusQuery.toUpperCase());
//
//			 if(cMatch >= 0)
//				 this.resultSet.push(this.dataSet[i]);
//		 }




		 SearchController.prototype.checkResults = function(){

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
			//var emptyPattern = new RegExp("\s"),
				//contentPattern = new RegExp("\W");
			return (searchQuery).trim() === ""; //this.searchQuery.search(emptyPattern) && !(this.searchQuery.search(contentPattern));

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
	 return uwiFieldValue.length === 16;
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

	 // TODO: Create a function to append error messages modularly.

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
		 }
	 } else if(section.length > 0) {
		 validity = false;
	 }

	 return validity && mandatoryField;
 }

 function checkCompanyInput(companyFieldValue) {
	 return companyFieldValue.length > 0;
 }

 function createErrorMessage(message) {
	 return '<label class = "error-msg">'+message+'</br></label>';
 }