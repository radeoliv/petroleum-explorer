assert = require("chai").assert

{SearchController} = require "../../app/scripts/components/search/search.js"
mySearchController = new SearchController()
describe "Search", ->
	it "Has a valid search controller", ->
		assert.isObject(mySearchController)
	it "Returns null error message when passed null data", ->
		# arrange
		myTestSearchController = new SearchController(null)
		expected = myTestSearchController.NULL_ERROR_MESSAGE
		# act
		actual = myTestSearchController.findResults()
		# assert
		assert.equal(expected, actual)
