var express = require('express');
var router = express.Router();
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var utils = require('../utils.js');
var _ = require('underscore');

/**
  Mongo client implementation
*/
var mongo = {
    db: 'workshop',
    col: 'basic',
    host: 'localhost',
    port: '27017'
};

var url = 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.db;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// INSERT 
router.post('/insert', function (req, res) {

    var body = req.body;

    // new user logic
    Object.keys(body).forEach(function (prop) {
        if (!body[prop]) {
            delete body[prop];
        }
    });
    
    body.meats = JSON.parse(body.meats);

    if(!Array.isArray(body.meats)){
      body.meats = [body.meats]; 
    }

    //body.drinks = JSON.parse(body.drinks);
    if(!Array.isArray(body.drinks)){
      body.drinks = [body.drinks]; 
    }


    MongoClient.connect(url, function (err, db) {

        db.collection(mongo.col).insert(body, function (err, res) {
            console.log(res.ops);
            db.close();
        })
    });

    res.redirect('/');
});

// DELETE 
router.get('/delete/:_id', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(mongo.col);

        collection.remove({
            _id: new MongoDB.ObjectID(req.params._id)
        }, function (err, res) {
            console.log(res.result)
        });

    });

    res.redirect('/');
});

// Get by id
router.get('/look/:_id', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {

        var collection = db.collection(mongo.col);
        collection.find({
            _id: new MongoDB.ObjectID(req.params._id)
        }).toArray(function (err, docs) {
            req.invitee = docs[0];
            console.log(req.invitee.meats[0].name)
            next();
        });
    });
}, function (req, res) {
    var host = req.protocol + '://' + req.get('host');
    var meats = utils.meats;
    var drinks = utils.drinks;

    // render page tu update
    res.render('look', {
        title: 'MongoDB Grill',
        host: host,
        invitee: req.invitee,
        meats: meats,
        drinks: drinks,
        _:_
    });
});

// UPDATE
router.post('/update', function (req, res, next) {
    var host = req.protocol + '://' + req.get('host');
    var body = req.body;
    console.info('to update',body);

    MongoClient.connect(url, function (err, db) {
        var collection = db.collection(mongo.col);
          console.info(body.meats);      


        if( typeof body.meats  == "string"){
          body.meats = [JSON.parse(body.meats)];
        }
        else if(!Array.isArray(body.meats)){
          body.meats = [body.meats]; 
        }else{

          body.meats = body.meats.map(function(meat){
          	return JSON.parse(meat);
          });
        };

        collection.update({
            _id: new MongoDB.ObjectID(body._id)
        }, {
        	$set:{
        	  meats: body.meats,
        	  drinks: body.drinks,
        	  firstName: body.firstName,
        	  lastName: body.lastName,
        	},
            $inc: {
                qtyUpdates: 1
            }
        }, function (err, res) {
            console.log(res);
            next();
        });


    });
}, function (req, res) {

    res.redirect('/');
});







module.exports = router;
