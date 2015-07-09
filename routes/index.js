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
    // middleware most voted drinks
    function (req, res, next){
      next();
    },
    // approximate Cooperation
    function (req, res, next) {

        var meatCoop = req.mvMeats[0] ? req.mvMeats[0]._id.price / 3 : 0;

        //coop until now
        req.coopPerPerson = meatCoop;
        next();
    },
    // Total budget
    function (req, res, next) {
        //TODO : render total budget
        req.totalBudget = req.coopPerPerson * req.list.length;
        next();
    },
    function (req, res) {
        var meats = utils.meats,
            drinks = utils.drinks;

        res.render('index', {
            title: 'MongoDB Grill',
            list: req.list,
            meats: meats,
            mvMeats: req.mvMeats,
            coopPerPerson: req.coopPerPerson
        });
    });

module.exports = router;
