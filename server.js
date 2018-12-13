
var mysql = require('mysql')

/* var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tenis",
    multipleStatements: "true"
});

con.connect(function(err) {
    if (err) throw err
    console.log("Connected!");
}) */

var con = mysql.createConnection({
    host: "eu-cdbr-west-02.cleardb.net",
    user: "bef10cec361e81",
    password: "a1790973",
    database: "heroku_8c4a2b31f479d26",
    multipleStatements: "true"
});

con.connect(function(err) {
    if (err) throw err
    console.log("Connected!");
})

function handleDisconnect(conn) {
    conn.on('error', function(err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        /* console.log('Re-connecting lost connection: ' + err.stack); */
        console.log('Re-connecting lost connection');

        con = mysql.createConnection(conn.config);
        handleDisconnect(con);
        con.connect();
    });
}
  
handleDisconnect(con);

const express = require("express");
const fs = require("fs");
var moment = require('moment');
var moment = require('moment-timezone');
var app = express();
var bodyParser = require('body-parser');
app.use(express.json());

var auth = require('http-auth')
var basic = auth.basic({
    file: __dirname + "/user.htpasswd",
    challenge: true
});

app.use(function(req, res, next) {
    if ('/index_admin.html' === req.path || '/booked_hours.html' === req.path || '/user.htpasswd' === req.path) {
        (auth.connect(basic))(req, res, next);
    } else {
        next();
    }
});

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/load_colors', function(req, res) {
    const sql = "SELECT ph.id, ho.val FROM playing_hours as ph JOIN hour_options as ho ON ph.valueID = ho.id ORDER BY ph.id ASC"
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/playing_hours', function(req, res) {
    const sql = "UPDATE playing_hours SET valueID ='" + req.query.valueID + "' WHERE id =" + req.query.id +";"
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/load_colors_booked', function(req, res) {
    const sql = "SELECT bh.id, ho.val FROM booked_hours as bh JOIN hour_options as ho ON bh.valueID = ho.id ORDER BY bh.id ASC"
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/booked_hours', function(req, res) {
    const sql = "UPDATE booked_hours SET valueID ='" + req.query.valueID + "' WHERE id =" + req.query.id +";"
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

var PORT = process.env.PORT || 8000;

var server = app.listen(PORT, function() {
    console.log('running')
    checkWeek()
})

const checkWeek = () => {
    interval = 1000 * 60

    const numOfBoxes = 294;
    var valuesWeek2 = []
    var valuesBooked = []

    var yearNow = moment().tz("Europe/Prague").year()
    var yearBeforeHour = moment().tz("Europe/Prague").subtract(1, 'hours').year()

    var weekNow = moment.tz("Europe/Prague").isoWeek()
    var weekBeforeHour = moment.tz("Europe/Prague").subtract(1, 'hours').isoWeek()

    /* console.log("years: ", yearNow, " ", yearBeforeHour, "weeks: ", weekNow, " ", weekBeforeHour) */

    if (weekNow !== weekBeforeHour || yearNow !== yearBeforeHour) {
        const sql = "SELECT isReset FROM weeks WHERE year = " + yearBeforeHour + " AND week = " + weekBeforeHour + ""
        console.log(sql)
        con.query(sql, function (err, results) {
            if (err) throw err
            console.log(results[0].isReset)
            if (results[0].isReset == 0) {
                const sql2 = "INSERT INTO weeks (year, week) VALUES ('" + yearNow + "', '" + weekNow + "'); UPDATE weeks SET isReset = 1 WHERE year = " + yearBeforeHour + " AND week = " + weekBeforeHour
                con.query(sql2, function (err, results) {
                    if (err)  throw (err)
                    console.log(results)
                })

                const sql3  = "SELECT * FROM playing_hours ORDER BY id ASC; SELECT * FROM booked_hours ORDER BY id ASC"
                con.query(sql3, function (err, results) {
                    if (err) throw err
                    console.log(results)
                    for(var x = 0; x < numOfBoxes; x++) {
                        valuesWeek2[x] = results[0][x+numOfBoxes].valueID
                        valuesBooked[x] = results[1][x].valueID
                    }
                    console.log(valuesWeek2, valuesBooked)

                    for(var i = 0; i < numOfBoxes; i++) {
                        const sql4 = "UPDATE playing_hours SET valueID = '" + valuesWeek2[i] + "' WHERE id = " + (i+1) + "; UPDATE playing_hours SET valueID = '" + valuesBooked[i] + "' WHERE id = " + (i+1+numOfBoxes)
                        console.log(sql4)
                        con.query(sql4, function (err, results) {
                            if (err) throw err
                        })
                    }  
                })
            }
        })
    }


    setTimeout(() => {
        checkWeek()
    }, interval)
}

var http = require("http");
setInterval(function() {
    http.get("http://tkstrakonice.herokuapp.com");
}, 900000); // every 15 minutes (900000)