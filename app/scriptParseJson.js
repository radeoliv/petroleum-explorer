
/*--------------------------------------------------------------------------------
Author: robinbesson

=============================================================================
Filename:
=============================================================================
//TODO: file description
-------------------------------------------------------------------------------*/

var dataSet = require('./backup.json');
var fs = require('fs')

for(var i=0; i<dataSet.length;i++) {

	dataSet[i]["Longitude Decimal Degrees"] = parseFloat(dataSet[i]["Longitude Decimal Degrees"]);
	dataSet[i]["Latitude Decimal Degrees"] = parseFloat(dataSet[i]["Latitude Decimal Degrees"]);
	dataSet[i]["Well_Drillers_Total_Depth"] = parseFloat(dataSet[i]["Well_Drillers_Total_Depth"].replace(',','.'));
	dataSet[i]["PHIc"] = parseFloat(dataSet[i]["PHIc"].replace(',','.'));
	dataSet[i]["PHIR"] = parseFloat(dataSet[i]["PHIR"].replace(',','.'));
	dataSet[i]["Vshc"] = parseFloat(dataSet[i]["Vshc"].replace(',','.'));
	dataSet[i]["Soc"] = parseFloat(dataSet[i]["Soc"].replace(',','.'));
	dataSet[i]["KRc"] = parseFloat(dataSet[i]["KRc"].replace(',','.'));
	dataSet[i]["KRav"] = parseFloat(dataSet[i]["KRav"].replace(',','.'));
	dataSet[i]["H"] = parseFloat(dataSet[i]["H"].replace(',','.'));
	dataSet[i]["Pc"] = parseFloat(dataSet[i]["Pc"].replace(',','.'));
	dataSet[i]["Pp"] = parseFloat(dataSet[i]["Pp"].replace(',','.'));
	dataSet[i]["Pt"] = parseFloat(dataSet[i]["Pt"].replace(',','.'));

}
var jsonFile = JSON.stringify(dataSet);

fs.writeFileSync('wells.json', jsonFile);