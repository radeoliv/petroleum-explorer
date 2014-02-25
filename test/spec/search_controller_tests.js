
 /*--------------------------------------------------------------------------------
	Author: ad3sh

	=============================================================================
	Filename:  search_controller_tests
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 //var search_controller = require("../../app/scripts/my-module.js");

 var assert = require("assert");

 describe("Search controller", function () {
	 /*beforeEach(function (done) {
		 var sampleData = {
			 "locationData": {
					"data":[0, 3, 4, 5]
			 }
		 };
	 });*/
	 it("Returns an error when data set is null", function () {
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
	 it("Returns an error when search query is empty", function () {
		 //arrange
		 var sampleNullDataSet = null,
			 sampleQuery = "";
		 var mySearchController = new search_controller(sampleNullDataSet,sampleQuery);
		 //act
		 var actual = mySearchController.sampleQuery;
		 var expected = "";
		 //assert
		 assert.equal(actual,expected);
	 });
	 it("Returns an warning when search resultset is empty", function () {
		 //arrange
		 var sampleNullDataSet = null,
		 	 sampleQuery = "";
		 var mySearchController = new search_controller(sampleNullDataSet, sampleQuery);
		 //act
		 var actual = mySearchController.countResults();
		 var expected = 0;
		 //assert
		 assert.equal(actual,expected);
	 });
	 it("Returns an error when search query is null", function () {
		 //arrange
		 var sampleNullDataSet = null,
			 sampleQuery = null;
		 var mySearchController = new search_controller(sampleNullDataSet,sampleQuery);
		 //act
		 var actual = mySearchController.sampleQuery;
		 var expected = null;
		 //assert
		 assert.equal(actual,expected);
	 });


 });
