var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var mongo = {
  db: 'workshop',
  col: 'basic',
  host: 'localhost',
  port: '27017'
};
var url = 'mongodb://'+mongo.host+':'+mongo.port+'/'+mongo.db;
/* GET home page. */
router.get('/', function(req,res,next){
	
	MongoClient.connect(url, function(err, db) {
  		//find all customers
  		var query = {};
  		db.collection(mongo.col).find(query).sort({firstName:1}).toArray(function(err, docs){
  			req.list = docs;
  			next();
  		});
	});
},function(req, res, next) {
  res.render('index', { title: 'MongoDB CRUD Basics', list: req.list});
});

module.exports = router;
