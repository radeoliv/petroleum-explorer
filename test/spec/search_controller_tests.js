
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
	  * search controller does not accept when the dataset we are searching into is null
	  */
	 it("Returns an error when data set is null", function () {
		 //arrange
		 var lsdQuery = "AA";
		 var sectionQuery = "AA";
		 var townshipQuery = "AAA";
		 var rangeQuery = "BB";
		 var meridian_query = "C";
		 var sampleNullDataSet = null;
		 var resultSet = [];
		 var mySearchController = new search_controller.SearchController(sampleNullDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResultsUWIValues(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridian_query);
		 var expected = mySearchController.NULL_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual, expected);
	 });

	 /**
	  * search controller does not accept when search query is null
	  */
	 it("Returns an error when search query is null", function () {
		 //arrange
		 var lsdQuery = "AA";
		 var sectionQuery = null;
		 var townshipQuery = "AAA";
		 var rangeQuery = "BB";
		 var meridian_query = "C";
		 var sampleEmptyDataSet = [],
		 resultSet = [];
		 var mySearchController = new search_controller.SearchController(sampleEmptyDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResultsUWIValues(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridian_query);
		 var expected = mySearchController.NULL_QUERY_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual,expected);
	 });
	 /**
	  * search controller does not accept when the search query is undefined
	  */
	 it("Returns an error if search query is undefined", function () {
		 //arrange
		 var lsdQuery = "AA";
		 var sectionQuery; //Undefined
		 var townshipQuery = "AAA";
		 var rangeQuery = "BB";
		 var meridian_query = "C";
		 var resultSet = sampleDataSet = [];
		 var mySearchController = new search_controller.SearchController(sampleDataSet,resultSet);
		 //act
		 var actual = mySearchController.findResultsUWIValues(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridian_query);
		 var expected = mySearchController.UNDEFINED_ERROR_MESSAGE;
		 //assert
		 assert.equal(actual, expected);
	 });


	 //Cover the edge case of a one entry data set.
	 it("One entry data set", function () {
		 //arrange
		 var oneEntryDataSet = [
			 {
				 "location": {
					 "latitude":  0.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102141204501W400"
			 }
		 ];
		 //Will find this query.
		 var lsdQuery1 = "14";
		 var sectionQuery1 = "12";
		 var townshipQuery1 = "045";
		 var rangeQuery1 = "01";
		 var meridian_query1 = "4";
		 //Will not find this query.
		 var lsdQuery2 = "14";
		 var sectionQuery2 = "12";
		 var townshipQuery2 = "051";
		 var rangeQuery2 = "01";
		 var meridian_query2 = "4";
		 var resultSet = [];
		 var mySearchController = new search_controller.SearchController(oneEntryDataSet, resultSet);
		 //assert
		 var actual1 = mySearchController.findResultsUWIValues(lsdQuery1, sectionQuery1, townshipQuery1, rangeQuery1, meridian_query1);
		 var expected1 = oneEntryDataSet;
		 assert.deepEqual(actual1, expected1);

		 var actual2 = mySearchController.findResultsUWIValues(lsdQuery2,sectionQuery2, townshipQuery2, rangeQuery2, meridian_query2);
		 var expected2 = [];
		 assert.deepEqual(actual2, expected2);
	 });


	 //Small data set
	 it("Find correct UWIDs in a small data set", function () {
		 //arrange
		 var SmallDataSet = [
			 {
				 "location": {
					 "latitude":  0.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102050704807W400"
			 },
			 {
				 "location": {
					 "latitude":  45.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102141204501W400"
			 },
			 {
				 "location": {
					 "latitude":  90.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "100140405102W400"
			 }
		 ];
		 var lsdQuery = "14";
		 var sectionQuery = "12";
		 var townshipQuery = "045";
		 var rangeQuery = "01";
		 var meridian_query = "4";
		 var resultSet = [];
		 var mySearchController = new search_controller.SearchController(SmallDataSet, resultSet);
		 //act
		 var actual = mySearchController.findResultsUWIValues(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridian_query);
		 var expected = [
			 {
				 "location": {
					 "latitude":  45.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102141204501W400"
			 }
		 ];
		 //assert
		 assert.deepEqual(actual, expected);
	 });

	 //Small data set, query fields not all specified.
	 it("Find correct UWIDs in a small data set when not all the queries are specified", function () {
		 //arrange
		 var SmallDataSet = [
			 {
				 "location": {
					 "latitude":  0.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102050704807W400"
			 },
			 {
				 "location": {
					 "latitude":  90.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102141204501W400"
			 },
			 {
				 "location": {
					 "latitude":  -90.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "100141205101W400"
			 }
		 ];
		 var lsdQuery = "14";
		 var sectionQuery = "12";
		 var townshipQuery = "";
		 var rangeQuery = "01";
		 var meridian_query = "4";
		 var resultSet = [];
		 var mySearchController = new search_controller.SearchController(SmallDataSet, resultSet);
		 //act
		 var actual = mySearchController.findResultsUWIValues(lsdQuery, sectionQuery, townshipQuery, rangeQuery, meridian_query);
		 var expected = [
			 {
				 "location": {
					 "latitude":  90.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "102141204501W400"
			 },
			 {
				 "location": {
					 "latitude":  -90.0,
					 "longitude": 0.0
				 },
				 "Well_Unique_Identifier_Simplified_Format":      "100141205101W400"
			 }
		 ];
		 //assert
		 assert.deepEqual(actual, expected);
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
