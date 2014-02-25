###
	@author: Shawn Eastwood
	@package: seng515-petroleum-explorer
###

class VisualizationController
	constructor: (@oil_data, @discrete_flag) ->
	getVisualizationMethod: ->
		if @discrete_flag is on
			"discrete"
		else
			"histogram"

(exports ? window).VisualizationController = VisualizationController