 /*--------------------------------------------------------------------------------
	Author: Rodrigo Silva

	petroleum-explorer

	=============================================================================
	Filename: export-controller.js
	=============================================================================
	This process and execute the commands from the view. It exports the file with
	the wells data.
-------------------------------------------------------------------------------*/

 (function() {
	 var ExportController;

	 ExportController = (function() {
		 /*
		  * Constructor for the export controller
		  */
		 function ExportController(FullTable) {
			 this.FullTable = FullTable;
		 }

		 /**
		  * Generates a string containing all the values of the current wells in a specific format to generate a csv file.
		  * @returns {string}
		  */
		 ExportController.prototype.getDataToExport = function() {
			 var allDataString = "";
			 var lineBreak = "%0D%0A";
			 var space = "%20";
			 var formattedHeaders = [];
			 var currentTableHeaders = this.FullTable.getCurrentTableHeaders();
			 var currentTableData = this.FullTable.getCurrentTableData();

			 // Removing the first header (related to the checkbox)
			 currentTableHeaders.splice(0,1);

			 // Removing the spaces among the headers
			 for(var i=0; i<currentTableHeaders.length; i++) {
				 formattedHeaders.push(currentTableHeaders[i].replace(/ /g,""));
			 }

			 // The first part is to store the headers..
			 allDataString += currentTableHeaders.join() + "\n";

			 // Then, the values of the wells for each header..
			 for(var i=0; i<currentTableData.length; i++) {
				 var tempString = "";
				 for(var j=0; j<formattedHeaders.length; j++) {
					 tempString += currentTableData[i][formattedHeaders[j]];

					 if(j < formattedHeaders.length - 1) {
						 tempString += ",";
					 } else {
						 tempString += "\n";
					 }
				 }
				 allDataString += tempString;
			 }

			 // Now, we have to encode some special characters, as only a limited subset is allowed in URLs!
			 allDataString = allDataString.replace(/ /g, space);
			 allDataString = allDataString.replace(/\n/g, lineBreak);

			 // Done!
			 return allDataString;
		 };

		 return ExportController;
	 })();

	 (typeof exports !== "undefined" && exports !== null ? exports : window).ExportController = ExportController;

 }).call(this);