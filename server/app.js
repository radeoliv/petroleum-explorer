
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var clusterfck = require("clusterfck");
var methodOverride = require('method-override');

var pg = require('pg');
var conString = "postgres://postgres:admin123@localhost/dbpetroleum";

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/getAllWells', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		client.query("SELECT * FROM wells", function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			console.log(result.rows);
			res.send(result.rows);
		});
	});
});

app.get('/getInfoFromWell/:uwi', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		
		var dbuwi = req.params.uwi;
		
		client.query("SELECT * FROM wells WHERE w_uwi = '" + dbuwi + "'", function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			console.log(result.rows);
			res.send(result.rows);
		});
	});
});

app.get('/getStatusInfoFromWell/:uwi', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		
		var dbuwi = req.params.uwi;
		var query = "SELECT s_status, s_date FROM STATUS WHERE status.w_id in (SELECT w_id FROM wells WHERE w_uwi = '" + dbuwi + "') order by s_date";
		client.query(query, function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			res.send(result.rows);
		});
	});
});

app.get('/getAllDistinctStatuses', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		
		client.query("SELECT distinct(s_status) FROM STATUS order by s_status", function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			res.send(result.rows);
		});
	});
});

app.get('/getInjectionInfoFromWell/:uwi', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		var dbuwi = req.params.uwi;

		var query = "SELECT i_month, i_year, i_prod_type, i_value FROM injection WHERE injection.w_id IN (SELECT w_id FROM wells WHERE w_uwi = '" + dbuwi + "') ORDER BY i_year, i_month;";

		client.query(query, function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			res.send(result.rows);
		});
	});
});

app.get('/getProductionInfoFromWell/:uwi', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		var dbuwi = req.params.uwi;

		var query = "SELECT * FROM production WHERE production.w_id IN (SELECT w_id FROM wells WHERE w_uwi = '" + dbuwi + "') ORDER BY p_year, p_month;";

		client.query(query, function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}
			res.send(result.rows);
		});
	});
});

app.get('/applyKmeansToWells/:params', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	var params = req.params.params;

	var tempParams = params.split("&");
	var field = tempParams[0];
	var clusterNumber = tempParams[1];
	var uwis = tempParams[2];
	uwis = uwis.split(",");

	// The UWIs are in the same order as the client (we must save the index to increase client performance)
	var cleanUWIs = [];
	for(var i=0; i<uwis.length; i++) {
		cleanUWIs.push({ index: i, uwi:uwis[i] });
	}

	cleanUWIs.sort(function(a, b) {
		return sortAlphabetically(a["uwi"], b["uwi"]);
	});

	uwis.sort(function(a, b) {
		return sortAlphabetically(a, b);
	});

	for(var i=0; i<uwis.length; i++) {
		uwis[i] = "'" + uwis[i] + "'";
	}
	uwis = uwis.join();

	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		var query = "SELECT w_uwi," + field + " FROM wells WHERE w_uwi in (" + uwis + ") order by w_uwi";

		client.query(query, function(err, result) {
			//call `done()` to release the client back to the pool
			done();

			if(err) {
				return console.error('error running query', err);
			}

			var rows = result.rows;
			var formattedRows = [];
			for(var i=0; i<rows.length; i++) {
				formattedRows.push([ rows[i][field] ]);
				formattedRows[i].uwi = rows[i]["w_uwi"];
				if(formattedRows[i].uwi === cleanUWIs[i]["uwi"]) {
					formattedRows[i].index = cleanUWIs[i]["index"];
				}
			}

			// Execute the k-means clustering
			var clusters = clusterfck.kmeans(formattedRows, clusterNumber);

			// Setting the index to the result array
			var resultValues = [];
			for(var i=0; i<clusters.length; i++) {
				var tempCluster = [];
				for(var j=0; j<clusters[i].length; j++) {
					tempCluster.push({ index: clusters[i][j].index, value: clusters[i][j] })
				}
				resultValues.push(tempCluster);
			}

			res.send(resultValues);
		});
	});
});

function sortAlphabetically(a, b) {
	if(a === b) {
		return 0;
	} else if(a < b) {
		return -1;
	} else {
		return 1;
	}
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});