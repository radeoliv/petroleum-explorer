
 /*--------------------------------------------------------------------------------
	Author: mandy
	www: http://seangoresht.com/
	github: https://github.com/srsgores

*/
var assert = require("chai").assert;

 var visualizationView = function(data){
	 this.data = data;
	 if(this.data === null)
	 {
		 return "Data was " + this.data;
	 }
 };

 visualizationView.prototype.printVisualization = function (data){
	 if (this.data === null)
	 {
		 return "Data was null. Please specify valid data.";
	 }
	 else return "This data was" + this.data;
 };

 describe("Valid Visualization Input", function () {

	 it("Returns an error when a null string is passed", function () {
		 //arrange
		 var visualizationViewObject = new visualizationView(null);

		 //act
		 var actual = visualizationViewObject.printVisualization();
		 var expected = "Please pass in a value!";
		 //assert
		 assert.equal(actual, "Data was null. Please specify valid data.");
	 });


 });



