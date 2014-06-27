
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

app.get('/getInfoFromWell/:id', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		
		var id = req.params.id;
		
		client.query("SELECT * FROM wells WHERE w_id = " + id, function(err, result) {
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
		
		client.query("SELECT s_status, s_date FROM STATUS WHERE status.w_id in (SELECT w_id FROM wells WHERE w_uwi = '" + dbuwi + "') order by s_date", function(err, result) {
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});