
 /*--------------------------------------------------------------------------------
	Author: ad3sh

	=============================================================================
	Filename:  search_controller_tests
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 //var search_controller = require("../../app/scripts/my-module.js");

 var search_controller = function (sampleNullDataSet, sampleQuery) {
	 
 };
 describe("Search controller", function () {
	 /*beforeEach(function (done) {
		 var sampleData = {
			 "locationData": {
					"data":[0, 3, 4, 5]
			 }
		 };
	 });*/
	 it("Returns an error when data set is empty", function () {
		 //arrange
		 var sampleNullDataSet = null,
			sampleQuery = "Whatever";
		 var mySearchController = new search_controller(sampleNullDataSet, sampleQuery);
		 //act
		 var actual = mySearchController.findResults();
		 var expected = "Could not find data, as it was null";
		 //assert
		 assert.equal(actual, expected);
	 });
 });
