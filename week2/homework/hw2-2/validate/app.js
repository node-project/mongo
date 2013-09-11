var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;

var mongoclient = new MongoClient( new Server('localhost', 27017, { 'native_parser' : true}) );

var db = mongoclient.db('weather');
var db2 = mongoclient.db('weather');
var state = "";

mongoclient.open(function (err, mongoclient){

	if(err) throw err;

	var query = {};
	
	var cursor = weather.find({},{},options).stream();
	  var State = 'Test';
	  var items = []; 
	   
	  cursor.on('data', function(item) {
	    if (item.State !== State) {
	      items.push(item);
	      State = item.State;
	    }
	    
	  });
	  
	  cursor.on('end', function() {
	    console.log(items); 
	    db.close();
	  });


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