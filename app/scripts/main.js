/*--------------------------------------------------------------------------------
 Author: admin
 www: http://seangoresht.com/
 github: https://github.com/srsgores

 twitter: http://twitter.com/S.Goresht

 seng-515-petroleum-explorer-rodrigo

 =============================================================================
 Filename:main.js
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/
jQuery(document).ready(function ($) {
	/* =============================================================================
	 Variables
	 ========================================================================== */
	var mapToolbar = $(".mapToolbar"),
		toolbarToggle = mapToolbar.find(".show-toolbar"),
		mapToolbarIcon = toolbarToggle.find("i"),
		mapToolbarContent = mapToolbar.find(".toolbar-content");

	var searchButton = mapToolbar.find(".show-search");


	function initMapToggle() {
		hideMapContent(mapToolbarContent);
		toolbarToggle.on("click", function (e) {
			mapToolbarContent.toggle("slow");
			// toggle icon
			mapToolbarIcon.toggleClass("icon-expand icon-contract");
		});
	}

	function hideMapContent(mapContent) {
		mapContent.hide();
	}
	initMapToggle();

	function callSearch(){
		searchButton.on("click", function(e) {
			
		});


	}

	callSearch();


});