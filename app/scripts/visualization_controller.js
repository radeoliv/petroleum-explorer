/*--------------------------------------------------------------------------------
 Author: Shawn Eastwood


 seng515-petroleum-explorer

 =============================================================================
 Filename:
 =============================================================================
 //TODO: file description
 -------------------------------------------------------------------------------*/



//TODO: Implement oil_well_filter class.
function Oil_well_filter(oil_data, discrete_flag) {
	this.oil_data = oil_data;
	this.discrete_flag = discrete_flag;
};

Oil_well_filter.prototype.get_visualization_method = function () {

	return "histogram";
};

//class = {}