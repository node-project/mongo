/*
	1. Create simple server in node.js
*/

/*var http = require('http');

var server = http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type":"text/plain"});
	response.end("Hello, World\n");
});

server.listen(8000);

console.log("Server started from http://localhost:8000");*/

/*
	2. Intro to NPM
*/

/*var express = require('express'),
	cons  	= require('consolidate')
	mongodb = require('mongodb');*/

/**
*	3. Hello World MongoDB
*/

/*var MongoClient = require('mongodb').MongoClient;

//Open the connection to the db server
MongoClient.connect( 'mongodb://localhost:27017/test', function(error, db) {

	if(error) throw error;


	//Find one document in our collection
	db.collection('testcoll').findOne({}, function(error, doc) {
		
		if(error) throw error;

		//Print the result
		console.dir(doc);

		//Close the DB
		db.close();
	});

	//Declare success
	console.dir("Called findOne!");

});*/

/**
*	4. Hello World with Express
*/

/*var express = require('express'),
	app = express();

app.get('/', function(req, res) {
	res.send("Hello World!");
});

app.get('*', function(req, res) {
	res.send("Not Found!", 404);
});

app.listen(8080);

console.log("Server started");*/

/**
*	5. Hello World with Express and Swig
*/

/*var express = require('express'),
	app = express(),
	cons = require('consolidate');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

app.get('/', function(req, res) {
	res.render('hello', { 'name': 'Egee'});
});

app.get('*', function(req, res) {
	res.send("Not Found!", 404);
});

app.listen(8080);

console.log("Server started"); */

/**
*	6. Hello World with Express, Swig and MongoDB
*/

/*var express = require('express'),
	app = express(),
	cons = require('consolidate'),
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

var mongoclient = new MongoClient( new Server('localhost', 27017, { 'native_parser' : true}) );

var db = mongoclient.db('test');

app.get('/', function(req, res) {

	db.collection('testcoll').findOne({"familyname" : "Gutierrez"}, function(err, doc) {

		console.log(doc);
		res.render('hello', doc);

	});
});

app.get('*', function(req, res) { 
	res.send("Not Found!", 404);
});

mongoclient.open(function (err, mongoclient){

	if(err) throw err;

	app.listen(8080);

	console.log("Server started"); 
});*/

/**
*	7. Express: Handling GET Request
*/

/*var express = require('express'),
	app = express(),
	cons = require('consolidate');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");
app.use(app.router);

//handler for internal server errors

function errorHandler(err, req, res, next) {
	console.error(err.message);
	console.error(err.stack);
	res.status(500);
	res.render('error_template', {error:err});
}

app.use(errorHandler);

app.get('/:name', function(req, res, next) {
	var name = req.params.name;
	var getvar1 = req.query.getvar1;
	var getvar2 = req.query.getvar2;

	res.render('hello', { name : name, getvar1: getvar1, getvar2 : getvar2});
});

app.listen(8080);
console.log('Starting server on localhost:8080');*/

/**
*	8. Express: Handling POST Request
*/
/*var express = require('express'),
	app = express(),
	cons = require('consolidate');

	app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");
app.use(express.bodyParser());
app.use(app.router);

//handler for internal server errors

function errorHandler(err, req, res, next) {
	console.error(err.message);
	console.error(err.stack);
	res.status(500);
	res.render('error_template', {error:err});
}

app.use(errorHandler);

app.get('/', function(req, res, next) {

	res.render('fruitPicker', { 'fruits' : ['apple', 'orange', 'banana', 'peach'] });
});

app.post('/favorite_fruit', function(req, res, next){
	var favorite = req.body.fruit;

	if(typeof favorite == 'undefined') {
		next(Error('Please choose a fruit!'));
	} else {
		res.send("Your favorite fruit is " + favorite);
	}
});

app.listen(8080);
console.log('Starting server on localhost:8080');*/

/**
*	9. Node.js Mongo CRUD
*/

var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;

var mongoclient = new MongoClient( new Server('localhost', 27017, { 'native_parser' : true}) );

var db = mongoclient.db('weather');
var db2 = mongoclient.db('weather');
var state = "";

mongoclient.open(function (err, mongoclient){

	if(err) throw err;

	var query = {};
	

	var cursor = db.collection("data").find( query ).sort({"State":1, "Temperature" : -1});

		cursor.each(
			function(err, doc) {
				if(err) throw err;

				if( doc == null )
				{
					return db.close();
				}

				if(state != doc.State)
				{
					state = doc.State;
					db2.collection("data").update(
						{ "_id" : doc._id},
						{$set : {"month_high" : true}},
						{"upsert" : true},
						function(err, result){
							console.dir("Result : " + result);
							
						}
					);
				}

				console.dir("var state: " + state);
				console.dir("State: " + doc.State);
			}
		);
});


/*MongoClient.connect(
	'mongodb://localhost:27017/weather' ,
	function(err, db){
		if (err) throw err;

		var state = "";
		var query = { "State" : { $exists : true}};

		var cursor = db.collection("data").find( query ).sort({"State":1, "Temperature" : -1});

		cursor.each(
			function(err, doc) {
				if(err) throw err;

				if( doc == null )
				{
					return db.close();
				}

				if(state != doc.State)
				{
					db.collection("data").update(
						{ "_id" : doc._id},
						{$set : {"month_high" : false}},
						{"upsert" : true},
						function(err, result){
							console.dir("Result : " + result);
							state = doc.State;
						}
					);
				}

				console.dir("var state: " + state);
				console.dir("State: " + doc.State);
			}
		);
	}
);*/