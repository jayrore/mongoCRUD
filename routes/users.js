var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/**
  Mongo client implementation
*/
var mongo = {
  db: 'workshop',
  col: 'basic',
  host: 'localhost',
  port: '27017'
};

var url = 'mongodb://'+mongo.host+':'+mongo.port+'/'+mongo.db;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/insert', function(req, res){

	var body = req.body;
	console.log(body);
	// new user logic
	Object.keys(body).forEach(function(prop) {
		if(!body[prop]){
			delete body[prop];	
		}
	});

	MongoClient.connect(url, function(err, db) {
  		console.log("Connected correctly to server");
  		
  		db.collection(mongo.col).insert(body, function(err, res){
  			console.log(res.ops);
  			db.close();
  		})
	});

	res.redirect('/');
})







module.exports = router;
