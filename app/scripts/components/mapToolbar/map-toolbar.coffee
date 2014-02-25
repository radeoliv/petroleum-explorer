$ ->
	# Variables
	mapToolbar = $(".mapToolbar")
	toolbarToggle = mapToolbar.find(".show-toolbar")
	mapToolbarIcon = toolbarToggle.find("i")
	mapToolbarContent = mapToolbar.find(".toolbar-content")
	searchContent = mapToolbarContent.find(".search-form").hide()
	searchButton = mapToolbar.find(".show-search")

	# Functions
	initMapToggle = ->
		hideMapContent mapToolbarContent
		toolbarToggle.on "click", ->
			mapToolbarContent.toggle "slow"
			# toggle icon
			mapToolbarIcon.toggleClass "icon-expand icon-contract"
	hideMapContent = (mapContent) ->
		mapContent.hide()
	callSearch = ->
		searchButton.on "click", (e) ->
			searchContent.toggle("slow")

	setToggle = ->
		mapToolbar.find("button").on "click", (e) ->
			$(this).toggleClass("active")

	initMapToggle()
	setToggle()
	callSearch()
