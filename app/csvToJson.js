
 /*--------------------------------------------------------------------------------
	Author: robinbesson

	petroleum-explorer

	=============================================================================
	Filename: csvToJson.js
	=============================================================================
	/!\ /!\ Be careful to change the token from ',' to ';' into the csv.js file in
	 order to have a correctly structured json file
-------------------------------------------------------------------------------*/
 var csv = require("../node_modules/csv-to-json/csv.js");

 //parses file into json and returns a json object<br>
 var json = csv.parse(/*path to the csv file*/);

 //writes the parsed file to a file<br>
 csv.write('./wells.json');