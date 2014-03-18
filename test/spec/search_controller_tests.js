
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
	 /**
	  * search controller does not accept when the search query is undefined
	  */
	 it("Returns an error if search query is undefined", function () {
		 //arrange
		 var lsdQuery = "";
		 var sectionQuery; //Undefined
		 var townshipQuery = "AAA";
		 var rangeQuery = "BB";
		 var resultSet = sampleDataSet = [];
		 var mySearchController = new search_controller.SearchController(sampleDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResults(lsdQuery, sectionQuery, townshipQuery, rangeQuery);
		 var expected = mySearchController.UNDEFINED_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual, expected);
	 });
	 /**
	  * search controller does not accept when the dataset we are searching into is null
	  */
	 it("Returns an error when data set is null", function () {
		 //arrange
		 var sampleNullDataSet = resultSet = null;
		 var query = "whatever";
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResults(query);
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
		 var sampleNullDataSet = [],
			 sampleQuery1 = "     ",
			 sampleQuery2 = "",
		 	 resultSet = null;
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet,resultSet);
		 //act
		 var actualMultiSpaceQuery = mySearchController.findResults(sampleQuery1);
		 var actualEmptyQuery = mySearchController.findResults(sampleQuery2);
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
		 var sampleNullDataSet = [],
		 	 sampleQuery = "whatever";
		 	 resultSet = [];
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResults(sampleQuery);
		 var expected = mySearchController.EMPTY_RESULTSET_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual,expected);
	 });
	 /**
	  * search controller does not accept when search query is null
	  */
	 it("Returns an error when search query is null", function () {
		 //arrange
		 var sampleNullDataSet = [],
			 sampleQuery = null;
		 	 resultSet = null;
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResults(sampleQuery);
		 var expected = mySearchController.NULL_QUERY_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual,expected);
	 });
	 it("parses json correctly", function () {
		 //arrange
		 var malFormedJson = [
			 {
				 "location": {
				 			"latitude": 65.180632,
				 			"longitude": -128.402744
			 	},
			 	"UNIQUEWELLID": "15/37-28-693-66W4/0"
			 },
			 {
				 "location": {
							 "latitude": -56.962571,
					 		"longitude": 113.626333
				 },
				 "UNIQUEWELLID": "36/40-92-89-46W4/0"
			 }
		 ];
		 var dataSet = [],
			 resultSet = [];
		 var mySearchController = new search_controller.SearchController(dataSet, resultSet);
		 //act
		 var actual = mySearchController.getMockData();
		 var expected = malFormedJson;
		 //assert
		 assert.deepEqual(actual, expected);
	 });


 });
