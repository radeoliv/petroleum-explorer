
 /*--------------------------------------------------------------------------------
	Author: ad3sh

	=============================================================================
	Filename:  search_controller_tests
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 var search_controller = require("../../app/scripts/components/search/search-controller.js");

 var assert = require("assert");

 describe("Search controller", function () {
	 /*beforeEach(function (done) {
		 var sampleData = {
			 "locationData": {
					"data":[0, 3, 4, 5]
			 }
		 };
	 });*/
	 it("Returns an error if search query is undefined", function () {
		 //arrange
		 var sampleQuery;
		 var resultSet = sampleDataSet = [];
		 var mySearchController = new search_controller.SearchController(sampleDataSet, sampleQuery,resultSet);
		 //act
		 var actual = mySearchController.findResults();
		 var expected = mySearchController.UNDEFINED_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual, expected);
	 });

	 it("Returns an error when data set is null", function () {
		 //arrange
		 var sampleNullDataSet = sampleQuery = resultSet = null;
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet, sampleQuery,resultSet);
		 //act
		 var actual = mySearchController.findResults();
		 var expected = "Could not find data, as it was null";
		 //assert
		 assert.equal(actual, expected);
	 });
	 /**
	  * search controller does not accept strings with only spaces
	  *
	  */
	 it("Returns an error when search query is empty", function () {
		 //arrange
		 var sampleNullDataSet = null,
			 sampleQuery1 = "  ",
			 sampleQuery2 = "",
		 	 resultSet = null;
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet, sampleQuery1,resultSet);
		 //act
		 var actualMultiSpaceQuery = mySearchController.findResults();
		 mySearchController.searchQuery = sampleQuery2;
		 var actualEmptyQuery = mySearchController.findResults();
		 var expected = mySearchController.EMPTY_SEARCH_QUERY_ERROR_MESSAGE;
		 //assert
		 assert.equal(actualMultiSpaceQuery,expected);
		 assert.equal(actualEmptyQuery,expected);
	 });
	 /**
	  * checks for our result set having a length less than 1
	  */
	 it("Returns a warning when search resultset is empty", function () {
		 //arrange
		 var sampleNullDataSet = null,
		 	 sampleQuery = "whatever";
		 	 resultSet = [];
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet, sampleQuery,resultSet);
		 //act
		 var actual = mySearchController.findResults();
		 var expected = mySearchController.EMPTY_RESULTSET_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual,expected);
	 });
	 it("Returns an error when search query is null", function () {
		 //arrange
		 var sampleNullDataSet = null,
			 sampleQuery = null;
		 	 resultSet = null;
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet, sampleQuery,resultSet);
		 //act
		 var actual = mySearchController.sampleQuery;
		 var expected = null;
		 //assert
		 assert.equal(actual,expected);
	 });

 });
