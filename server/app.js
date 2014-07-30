
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');

var pg = require('pg');
var conString = "postgres://postgres:admin123@localhost/dbpetroleum";

var app = express();


var clusterfck = require("clusterfck");

var colors = [
	[20, 20, 80],
	[22, 22, 90],
	[250, 255, 253],
	[0, 30, 70],
	[200, 0, 23],
	[100, 54, 100],
	[255, 13, 8]
];
var test =
	[
		[1],
		[2],
		[3],
		[4],
		[9],
		[10],
		[11],
		[12],
		[16],
		[17],
		[18],
		[19],
		[50],
		[51],
		[80],
		[85],
		[90],
		[95],
		[150],
		[151],
		[152],
		[153],
		[154]
	];

//var test =
//	[
//		[1,1,23],
//		[2,2,22],
//		[3,3,21],
//		[4,4,20],
//		[5,9,19],
//		[6,10,18],
//		[7,11,17],
//		[8,12,16],
//		[9,16,15],
//		[10,17,14],
//		[11,18,13],
//		[12,19,12],
//		[13,50,11],
//		[14,51,10],
//		[15,80,9],
//		[16,85,8],
//		[17,90,7],
//		[18,95,6],
//		[19,150,5],
//		[20,151,4],
//		[21,152,3],
//		[22,153,2],
//		[23,154,1]
//	];

var clusters = clusterfck.kmeans(test, 6);
console.log(clusters);

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
	// TODO: everything here will change!
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});