#--------------------------------------------------------------------------------
# Author: ad3sh
#
# seng515-petroleum-explorer
#
# =============================================================================
# Filename: search-controller.js
# =============================================================================
# //TODO: file description
# -------------------------------------------------------------------------------

# Node modules docs: http://nodejs.org/api/modules.html
# Right way to do OO js: http://stackoverflow.com/questions/12310070/node-js-module-exports-in-coffeescript

class SearchController
	@NULL_ERROR_MESSAGE: "Could not find data, as it was null"
	constructor: (@data) ->
	findResults: ->
		# @NULL_ERROR_MESSAGE  if @data is null
	showTwo: ->
		2

# Make the search controller globally available in Window
(exports ? window).SearchController = SearchController