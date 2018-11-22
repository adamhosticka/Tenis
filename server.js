var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tenis",
    multipleStatements: "true"
});

con.connect(function(err) {
    if (err) throw err
    console.log("Connected!");
})

const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
app.use(express.json());

const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { 'newuser': 'newpass' },
    challenge: true,
    realm: 'false ',
    file: ""
}))

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname));

/* cron.schedule("0 * * * * *", function() {
    console.log("running a task every minute");
});
 */

app.get('/load_colors', function(req, res) {
    const sql = "SELECT * FROM playing_hours"
    console.log(sql)
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/playing_hours', function(req, res) {
    const sql = "UPDATE playing_hours SET color ='" + req.query.color + "' WHERE id =" + req.query.id +";"
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/change_week', function(req, res) {
    const sql = "UPDATE playing_hours SET color ='" + req.query.color + "' WHERE id =" + req.query.id +";"
    console.log(sql)
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/load_colors_booked', function(req, res) {
    const sql = "SELECT * FROM booked_hours"
    console.log(sql)
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/booked_hours', function(req, res) {
    const sql = "UPDATE booked_hours SET color ='" + req.query.color + "' WHERE id =" + req.query.id +";"
    console.log(sql)
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)

    checkWeek()

})


const checkWeek = () => {
    interval = 1000 * 60
    // interval = 1 minute
    // get date now
    // get date now - 5 x interval
    // if different week -> resetDB
    // pro praci s casem se ti muze hodit knihovna moment
    // now = moment()
    // now.week()
    // now.year()
    // pozitri = now.add(2, 'days')
    // now.format(YYYY-MM-DD HH:mm:ss:SSS)
    // presnydatum = moment("2018-11-16 20:00", "YYYY-MM-DD HH:mm")
    // ukladat si nekam do nove tabulky> rok, tyden a boolean isReset true/false

    /* console.log(moment(moment().format()).isoWeek())
    console.log(moment().year())
    console.log(moment().add(1, 'weeks').calendar())
    
    console.log(moment(moment().subtract(1, 'days').format()).isoWeek()) */

    const numOfBoxes = 294;
    var colorsWeek2 = []
    var colorsBooked = []

    var yearNow = moment().year()
    var yearBeforeHour = moment(moment().subtract(1, 'hours').format()).year()

    var weekNow = moment().isoWeek()
    var weekBeforeHour = moment(moment().subtract(1, 'hours').format()).isoWeek()

    console.log("years: ", yearNow, " ", yearBeforeHour, "weeks: ", weekNow, " ", weekBeforeHour)

    if (weekNow !== weekBeforeHour) {
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

                const sql3  = "SELECT * FROM playing_hours; SELECT * FROM booked_hours"
                con.query(sql3, function (err, results) {
                    if (err) throw err

                    for(var x = 0; x < numOfBoxes; x++) {
                        colorsWeek2[x] = results[0][x+numOfBoxes].color
                        colorsBooked[x] = results[1][x].color
                    }

                    for(var i = 0; i < numOfBoxes; i++) {
                        const sql4 = "UPDATE playing_hours SET color = '" + colorsWeek2[i] + "' WHERE id = " + (i+1) + "; UPDATE playing_hours SET color = '" + colorsBooked[i] + "' WHERE id = " + (i+1+numOfBoxes)
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