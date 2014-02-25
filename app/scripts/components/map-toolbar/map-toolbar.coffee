class MapToolbar
	constructor: (@toggled, @mapToolbar, @toolbarToggle, @mapToolbarIcon, @mapToolbarContent, @searchButton) ->
		# Variables
		@mapToolbar = $(".mapToolbar")
		@toolbarToggle = @mapToolbar.find(".show-toolbar")
		@mapToolbarIcon = @toolbarToggle.find("i")
		@mapToolbarContent = @mapToolbar.find(".toolbar-content")
		@searchButton = @mapToolbar.find(".show-search")
		@searchForm = @mapToolbar.find(".search")
		@initMapToggle()
	initMapToggle: ->
		if @toggled is on then return
		@toggleMapToolbar()
		@toolbarToggle.on "click", =>
			@toggleMapToolbar()
	toggleMapToolbar: ->
		@mapToolbarContent.toggle("slow")
		# toggle icon
		@mapToolbarIcon.toggleClass "icon-expand icon-contract"
	initSearchForm: ->
		@searchButton.on "click", =>
			@toggleSearchForm()
	toggleSearchForm: ->
		@searchForm.toggle "slow"

(exports ? window).MapToolbar = MapToolbar