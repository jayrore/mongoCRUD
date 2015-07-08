var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var utils = require('../utils.js');

var mongo = {
    db: 'workshop',
    col: 'basic',
    host: 'localhost',
    port: '27017'
};
var url = 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.db;
/* GET home page. */
router.get('/', function (req, res, next) {

        MongoClient.connect(url, function (err, db) {
            //find all customers
            var query = {};
            db.collection(mongo.col).find(query).sort({
                firstName: 1
            }).toArray(function (err, docs) {
                req.list = docs;
                next();
            });
        });

    },
    // middleware most voted Meats
    function (req, res, next) {
        MongoClient.connect(url, function (err, db) {
            db.collection(mongo.col).aggregate([{
                $unwind: '$meats'
            }, {
                $group: {
                    _id: '$meats',
                    votes: {
                        $sum: 1
                    }
                }
            }, {
                $sort: {
                    votes: -1,
                    "_id.price": 1
                }
            }]).toArray(function (err, docs) {
                req.mvMeats = docs;
                db.close();
                next();
            });

        });
    },
    // middleware most voted Drinks
    function (req, res, next) {
        MongoClient.connect(url, function (err, db) {
            db.collection(mongo.col).aggregate([{
                $unwind: '$drinks'
            }, {
                $group: {
                    _id: '$drinks',
                    votes: {
                        $sum: 1
                    }
                }
            }, {
                $sort: {
                    votes: -1
                }
            }]).toArray(function (err, docs) {
                req.mvDrinks = docs;
                console.log(docs);
                db.close();
                next();
            });
        });
    },
    // approximate Cooperation
    function (req, res, next) {
        var meatCoop = req.mvMeats[0]._id.price / 3;

        //coop until now
        req.coopPerPerson = meatCoop;
        next();
    },
    function (req, res) {
        var meats = utils.meats,
            drinks = utils.drinks;

        res.render('index', {
            title: 'MongoDB Grill',
            list: req.list,
            meats: meats,
            drinks: drinks,
            mvMeats: req.mvMeats,
            mvDrinks: req.mvDrinks,
            coopPerPerson: req.coopPerPerson
        });
    });

module.exports = router;
