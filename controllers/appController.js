let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/mydb";
let request = require('request');


let bodyParser = require('body-parser');

let moment = require('moment');


module.exports = function(app) {
    // body...
    app.use(bodyParser.json());

    app.get('/home', function(req,res) {
        // body...
        res.render('index.pug', {title: "My Map"});
    });

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.post('/markerList', function(req, res) {
        // body...
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            let myobj = req.body;
            db.collection("node").remove({ 'nodeID': { $gt: -1 } }, function(err, obj) {
                if (err) throw err;
                console.log(obj.result.n + " document(s) deleted");
                db.close();
            });
            db.collection("node").insertMany(myobj, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });
        res.send("OK");
    });
    app.get('/jsonNode/:totalNode', function(req, res) {
        // body...
      
        MongoClient.connect(url, function(err, db) {
            let data;
            db.collection("node").find({}).toArray(function(err, result) {
                data = result;
                db.close();
            });
            var totalNode = parseInt(req.params.totalNode);
            // console.log(typeof totalNode);

            db.collection('data').find().sort({ timestamp: -1 }).limit(totalNode).toArray(
                function(err, items) {

                    for (let i = 0; i < totalNode; i++) {
                        data[i]["lastPm25"] = items[i].PM_25;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(data);
                    db.close();
                }
            );

            // db.collection("customers").find({}).toArray(function(err, result) {
            //     if (err) throw err;
            //     console.log(result);
            //     db.close();
            // });
        });
    });
    app.post('/data', function(req, res) {
        // let nodeID, PM_1, PM_2, PM_10, temp, hum, timestamp;
        // for (let i = 0; i < req.body.length; i++) {
        //     nodeID = req.body[i].nodeID
        //     PM_1 = req.body[i].PM_1
        //     PM_2 = req.body[i].PM_2
        //     PM_10 = req.body[i].PM_10
        //     temp = req.body[i].temp
        //     hum = req.body[i].hum
        //     timestamp = req.body[i].timestamp
        // }
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;

            let myobj = req.body;
            for (let i = 0; i < req.body.length; i++) {
                myobj[i]["time_receive"] = new Date();
                myobj[i]["timestamp"] = new Date(myobj[i].timestamp);
                myobj[i]["temp"] = parseFloat(myobj[i]["temp"]);

            }
            db.collection("data").insertMany(myobj, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });
        res.send("OK");
    });
    app.get('/jsonData/:nodeID', function(req, res) {
        // body...
        MongoClient.connect(url, function(err, db) {
            db.collection('data').find({"nodeID": parseInt(req.params.nodeID)}).sort({ timestamp: -1 }).limit(13).toArray(
                function(err, items) {
                    let temp = items;
                    for (let i = 0; i < temp.length; i++) {
                         temp[i]["timestamp"].setMilliseconds(0); // bo minisecond di de hien thi map dep hon :)
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(items);
                    db.close();
                }
            );
        });
    });
    app.get('/showdata', function(req, res) {
        // body...
        res.render('show.ejs');
    });
    app.post('/datademo', function(req, res) {
        console.log(req.body.length);
        res.send("OK");
    });
    app.post('/time', function(req, res) {
        mcu_time = req.body.time;
        server_time = moment().format();
        res.send('OK');
    });

    app.get('/removeDB', function(req, res) {
        // body...
        MongoClient.connect(url, function(err, db){
            db.collection("data").remove({'nodeID': {$gt: -1}}, function(err, obj) {
                // body...
                if (err) console.log(err);
                res.send("Remove " + obj.result.n + " document");
            })
        });
    });
}