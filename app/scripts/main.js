/*--------------------------------------------------------------------------------
 Author: admin
 www: http://seangoresht.com/
 github: https://github.com/srsgores

 twitter: http://twitter.com/S.Goresht

 seng-515-petroleum-explorer-rodrigo

 =============================================================================
 Filename:
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

	function initMapToggle() {
		hideMapContent(mapToolbarContent);
		toolbarToggle.on("click", function (e) {
			mapToolbarContent.toggle("slow");
			// toggle icon
			mapToolbarIcon.toggleClass("icon-arrow-left icon-arrow-right");
		});
	}
	function hideMapContent(mapContent) {
		mapContent.hide();
	}
	initMapToggle();
});