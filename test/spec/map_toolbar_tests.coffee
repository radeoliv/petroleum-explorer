assert = require("chai").assert

{MapToolbar} = require "../../app/scripts/components/map-toolbar/map-toolbar.js"
{SearchController} = require "../../app/scripts/components/search/search.js"

describe "mapToolbar", ->
	it "has a valid mapToolbar object", ->
		myMapToolbar = new MapToolbar()
		assert.isClass myMapToolbar
	