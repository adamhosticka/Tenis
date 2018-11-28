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

/* var con = mysql.createConnection({
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

        console.log('Re-connecting lost connection: ' + err.stack);

        con = mysql.createConnection(conn.config);
        handleDisconnect(con);
        con.connect();
    });
}
  
handleDisconnect(con); */

/* const cron = require("node-cron"); */
const express = require("express");
const fs = require("fs");
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
app.use(express.json());

/* const basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { 'newuser': 'newpass' },
    challenge: true
}))
console.log(basicAuth(options)) */

/* app.use(function(req, res, next) {
    if ('/index_admin.html' === req.path) {
        basicAuth.challenge = true
        next()
    }
    else {
        next()
    }
}); */

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

// Setup route.
/* app.get('/', function(req, res){
  res.send("Hello from express - " + req.user + "!");
}); */

// Setup guest route.
/* app.get('/index_admin.html', function(req, res){
  res.send("Hello from express - guest!");
}); */

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

/* cron.schedule("0 * * * * *", function() {
    console.log("running a task every minute");
});
 */

app.get('/load_colors', function(req, res) {
    const sql = "SELECT ph.id, ho.val FROM playing_hours as ph JOIN hour_options as ho ON ph.valueID = ho.id ORDER BY ph.id ASC"
    console.log(sql)
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
    console.log(sql)
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/booked_hours', function(req, res) {
    const sql = "UPDATE booked_hours SET valueID ='" + req.query.valueID + "' WHERE id =" + req.query.id +";"
    console.log(sql)
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

/* const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)

    checkWeek()

})
 */

var PORT = process.env.PORT || 8000;

var server = app.listen(PORT, function() {
    console.log('runin')
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
    var valuesWeek2 = []
    var valuesBooked = []

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