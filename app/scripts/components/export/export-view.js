
 /*------------------------------------------------------------------------------
	Author: Rodrigo Silva

	petroleum-explorer

	=============================================================================
	Filename: export-view.js
	=============================================================================
	This file captures the user input and call the appropriate function from the
	export-controller to generate the string representing the csv.
-------------------------------------------------------------------------------*/

 (function () {

	 var $fileNameTextBox = $('#fileName');
	 var $exportButton = $('#exportButton');
	 var self;

	 var ExportView;
	 ExportView = function (exportController){
		 this.exportController = exportController;
		 self = this;
		 $fileNameTextBox[0].placeholder = generateDefaultFileName();
	 };

	 function generateDefaultFileName() {
		 // Getting date to form the file name
		 var date = new Date();
		 // yyyy-mm-dd (ISO 8601)
		 var dateISO = date.toISOString().substring(0, 10);
		 return 'Petroleum-Explorer Wells ' + dateISO + '.csv';
	 }

	 $fileNameTextBox.on("keyup", function (e) {
		 // The user cannot define a file name starting with space in the beginning...
		 this.value = this.value.trimLeft();
		 // ... or with invalid characters!
		 this.value = this.value.replace(/[\\/:"*?<>|]+/g, '');
	 });

	 $exportButton.on("click", function(e) {
		 var actualFileName = $fileNameTextBox[0].value;
		 if(actualFileName === undefined || actualFileName === null || actualFileName.trim().length === 0) {
			 actualFileName = generateDefaultFileName();
		 } else {
			 // Checking if the file name provided has the right extension
			 var extension = actualFileName.substring(actualFileName.length - 4);
			 // If not, we put the right one
			 if(extension.toLowerCase() != ".csv") {
				 actualFileName += ".csv";
			 }
		 }

		 // Since the file name is now well defined, the values can be exported.
		 var data = self.exportController.getDataToExport();

		 // Creating a temporary HTML link element (they support setting file names)
		 var temp = document.createElement('a');
		 // Creating the header of the csv file
		 var data_type = 'data:application/vnd.ms-excel';
		 // Setting the content of the file
		 temp.href = data_type + ', ' + data;
		 // Setting the file name
		 temp.download = actualFileName;
		 // Triggering the function
		 temp.click();
		 // Just in case, prevent default behaviour
		 e.preventDefault();

		 // And finally, clean the file name text field
		 $fileNameTextBox[0].value = "";
	 });

	 (typeof exports !== "undefined" && exports !== null ? exports : window).ExportView = ExportView;
 }).call(this);