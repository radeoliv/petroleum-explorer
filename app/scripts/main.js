
 /*--------------------------------------------------------------------------------
	Author: robinbesson
	www: http://seangoresht.com/
	github: https://github.com/srsgores

	twitter: http://twitter.com/S.Goresht

	seng515-petroleum-explorer
	Do What the Fuck You Want License

	=============================================================================
	Filename:  
	=============================================================================
	//TODO: file description
-------------------------------------------------------------------------------*/

 jQuery(document).ready(function ($) {
	 function loadSearchController(){
		 window.search_controller === null || window.search_controller === 'undefined' ? alert('search controller has not been loaded') : console.log('search controller loaded');
		 var mySearchController = new SearchController();
	 }

 });