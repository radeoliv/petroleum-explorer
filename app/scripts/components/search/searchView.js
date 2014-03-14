/*--------------------------------------------------------------------------------
 Author: robinbesson
 www: http://seangoresht.com/
 github: https://github.com/srsgores

 twitter: http://twitter.com/S.Goresht

 seng515-petroleum-explorer
 Do What the Fuck You Want License

 =============================================================================
 Filename:
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/
var SearchView;
SearchView = function (searchController) {
	//TODO: create constructor for searchview
	this.searchController = searchController
};

/*
 * Static error messages
 */
var lsdErrorMsg = "<b>LSD</b> value must be within 01 and 16.",
	sectionErrorMsg = "<b>SEC</b> value must be within 01 and 36.",
	townshipErrorMsg = "<b>TWP</b> value must be within 001 and 126.",
	rangeErrorMsg = "<b>RNG</b> value must be within 01 and 34.",
	meridianErrorMsg = "<b>MER</b> value must be within 1 and 6.";

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
		companySearchInput = $searchInputForm.find("input[name='company']");

	var self = this;

	$searchInputSelector.on("keyup", function (e) { //retrieving the value in the input and saving it as a string variable.  Whenever a search input has typed in it, performs the search
		forceNumeric([lsdSearchInput, sectionSearchInput, townshipSearchInput, rangeSearchInput, meridianSearchInput]);

		var uwiQuery=uwiSearchInput[0].value,
			lsdQuery=lsdSearchInput[0].value,
			sectionQuery=sectionSearchInput[0].value,
			townshipQuery=townshipSearchInput[0].value,
			rangeQuery=rangeSearchInput[0].value,
			meridianQuery=meridianSearchInput[0].value,
			companyQuery=companySearchInput[0].value;

		if(checkUWIValueInputs([lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery])) {
			var results = self.searchController.findResults(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridianQuery, companyQuery); // return json object back

			var $resultsArea = $('<div id="results-table" class="handsontable"></div>').appendTo($searchInputForm); //append the results container if javascript enabled

			var data = [];
			if(results.length > 0)
				data.push(["UWI","Company","Status"]);

			for (var i=0;i<results.length;i++) {
				data.push([results[i]["UWI"], results[i]["Well_Opera"], results[i]["Well_Statu"]]);
				//TODO: show these corresponding pins
			}

			$('#results-table').handsontable({
				data: data,
				colHeaders: true,
				contextMenu: true
			});

			// Trigger the custom ResultsUpdated event on Body, telling other components that data has been updated
			$("body").trigger("ResultsUpdated");
			console.log("Results updated.  Results:");
			console.dir(this.resultSet);
		} else {
			// Cleaning the results area
			if($('#results-table') != undefined) {
				$('#results-table').remove();
			}
		}
	});
};

(typeof exports !== "undefined" && exports !== null ? exports : window).SearchView = SearchView;

function forceNumeric(fields) {
	// Replacing non numeric characters with empty string for UWI value search
	for(var i=0; i<fields.length; i++) {
		fields[i].val(fields[i][0].value.replace(/\D/g, ''));
	}
}

function clearFields() {
	// Clear all fields using field.val
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
			console.log("range shits!");
			$(createErrorMessage(townshipErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			mandatoryField = true;
		}
	} else if(township.length > 0) {
		console.log("length shits!");
		validity = false;
	}

	/*
	 * Range
	 */
	if(range.length === 2) {
		if(!(range >= 1 && range <= 34)) {
			console.log("range shits!");
			$(createErrorMessage(rangeErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			mandatoryField = true;
		}
	} else if(range.length > 0) {
		console.log("length shits!");
		validity = false;
	}

	/*
	 * Meridian
	 */
	if(meridian.length === 1) {
		if(!(meridian >= 1 && meridian <= 6)) {
			console.log("range shits!");
			$(createErrorMessage(meridianErrorMsg)).appendTo(divToAppend);
			validity = false;
		} else {
			mandatoryField = true;
		}
	} else if(meridian.length > 0) {
		console.log("length shits!");
		validity = false;
	}

	/*
	 * LSD
	 */
	if(lsd.length === 2) {
		if(!(lsd >= 1 && lsd <= 16)) {
			console.log("range shits!");
			$(createErrorMessage(lsdErrorMsg)).appendTo(divToAppend);
			validity = false;
		}
	} else if(lsd.length > 0) {
		console.log("length shits!");
		validity = false;
	}

	/*
	 * Section
	 */
	if(section.length === 2) {
		if(!(section >= 1 && section <= 36)) {
			console.log("range shits!");
			$(createErrorMessage(sectionErrorMsg)).appendTo(divToAppend);
			validity = false;
		}
	} else if(section.length > 0) {
		console.log("length shits!");
		validity = false;
	}

	return validity && mandatoryField;
}

function createErrorMessage(message) {
	return '<label class = "error-msg">'+message+'</br></label>';
}