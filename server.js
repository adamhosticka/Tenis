
var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tenis_test2",
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
}) */

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

var year
var week

app.get('/load_colors', function(req, res) {
    year = moment().tz("Europe/Prague").year()
    week =  moment().tz("Europe/Prague").isoWeek()
    const sql = `
        SELECT ph.boxId, ho.val
        FROM playing_hours as ph
        JOIN hour_options as ho 
        ON ph.valueID = ho.id 
        WHERE year = `+ year +` AND week = `+ week +`
        ORDER BY ph.boxId ASC
    `
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/playing_hours', function(req, res) {
    year = moment().tz("Europe/Prague").year()
    week =  moment().tz("Europe/Prague").isoWeek()
    const sql = "UPDATE playing_hours SET valueID ='" + req.query.valueID + "' WHERE boxId =" + req.query.id +" AND year = " + year + " AND week = " + week
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

    checkWeekValidity()
    checkWeek()
})


const numOfBoxes = 294;






const checkWeek = () => {
    interval = 1000 * 60

    var valuesWeek2 = []
    var valuesBooked = []

    var yearNow = moment().tz("Europe/Prague").year()
    var yearBeforeHour = moment().tz("Europe/Prague").subtract(1, 'hours').year()

    var weekNow = moment().tz("Europe/Prague").isoWeek()
    var weekBeforeHour = moment().tz("Europe/Prague").subtract(1, 'hours').isoWeek()
    
    if (weekNow !== weekBeforeHour) {
        const sql = "SELECT isReset FROM weeks WHERE year = " + yearBeforeHour + " AND week = " + weekBeforeHour + ""
        con.query(sql, function (err, results) {
            if (err) throw err
            console.log(results[0].isReset, "isReset")
            if (results[0].isReset == 0) {
                const sql2 = "INSERT INTO weeks (year, week) VALUES ('" + yearNow + "', '" + weekNow + "'); UPDATE weeks SET isReset = 1 WHERE year = " + yearBeforeHour + " AND week = " + weekBeforeHour
                con.query(sql2, function (err, results) {
                    if (err)  throw (err)
                })

                const sql3 = `
                    SELECT * FROM playing_hours
                    WHERE year = `+ yearBeforeHour +` AND week = `+ weekBeforeHour +`
                    ORDER BY boxId ASC;
                    SELECT * FROM booked_hours
                    ORDER BY id ASC
                `
                con.query(sql3, function (err, results) {
                    if (err) throw err

                    for(var x = 0; x < numOfBoxes; x++) {
                        valuesWeek2[x] = results[0][x+numOfBoxes].valueID
                        valuesBooked[x] = results[1][x].valueID
                    }

                    for(var i = 0; i < numOfBoxes; i++) {
                        const sql4 = `
                            INSERT INTO playing_hours (valueID, year, week, boxId)
                            VALUES (`+ valuesWeek2[i] +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1) +`);
                            INSERT INTO playing_hours (valueID, year, week, boxId)
                            VALUES (`+ valuesBooked[i] +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1+numOfBoxes) +`)
                        `
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

const checkWeekValidity = () => {
    var yearNow = moment().tz("Europe/Prague").year()
    var yearBeforeWeek = moment().tz("Europe/Prague").subtract(7, 'days').year()

    var weekNow = moment().tz("Europe/Prague").isoWeek()
    var lastWeek = moment().tz("Europe/Prague").subtract(7, 'days').isoWeek()
    
    var valuesWeek2 = []
    var valuesBooked = []

    const sql = "SELECT * FROM weeks WHERE year = " + yearNow + " AND week = " + weekNow + "; SELECT * FROM weeks WHERE year = " + yearBeforeWeek + " AND week = " + lastWeek
    con.query(sql, function (err, results) {
        if (err) throw err

        if(results[0].length === 0) {
            console.log('zaznam pro tento tyden jeste nebyl vytvoren')

            if(results[1].length === 0) {
                console.log('zaznam pro predchozi tyden jeste nebyl vytvoren')

                const sql2 = "INSERT INTO weeks (year, week, isReset) VALUES ('" + yearBeforeWeek + "', '" + lastWeek + "', '1'); INSERT INTO weeks (year, week) VALUES ('" + yearNow + "', '" + weekNow + "')"
                con.query(sql2, function (err, results) {
                    if (err)  throw (err)
                })

                const sql3 = `
                    SELECT * FROM booked_hours
                    ORDER BY id ASC
                `
                con.query(sql3, function (err, results) {
                    if (err) throw err

                    for(var x = 0; x < numOfBoxes; x++) {
                        valuesBooked[x] = results[x].valueID
                    }

                    for(var i = 0; i < numOfBoxes; i++) {
                        const sql4 = `
                            INSERT INTO playing_hours (valueID, year, week, boxId)
                            VALUES (`+ valuesBooked[i] +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1) +`);
                            INSERT INTO playing_hours (valueID, year, week, boxId)
                            VALUES (`+ valuesBooked[i] +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1+numOfBoxes) +`)
                        `
                        con.query(sql4, function (err, results) {
                            if (err) throw err
                        })
                    }  
                })
            }
            
            else {
                const sql2 = "INSERT INTO weeks (year, week) VALUES ('" + yearNow + "', '" + weekNow + "'); UPDATE weeks SET isReset = 1 WHERE year = " + yearBeforeWeek + " AND week = " + lastWeek
                con.query(sql2, function (err, results) {
                    if (err)  throw (err)
                })

                const sql3 = `
                    SELECT * FROM playing_hours
                    WHERE year = `+ yearBeforeWeek +` AND week = `+ lastWeek +`
                    ORDER BY boxId ASC;
                    SELECT * FROM booked_hours
                    ORDER BY id ASC
                `
                con.query(sql3, function (err, results) {
                    if (err) throw err

                    for(var x = 0; x < numOfBoxes; x++) {
                        valuesWeek2[x] = results[0][x+numOfBoxes].valueID
                        valuesBooked[x] = results[1][x].valueID
                    }

                    for(var i = 0; i < numOfBoxes; i++) {
                        const sql4 = `
                            INSERT INTO playing_hours (valueID, year, week, boxId)
                            VALUES (`+ valuesWeek2[i] +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1) +`);
                            INSERT INTO playing_hours (valueID, year, week, boxId)
                            VALUES (`+ valuesBooked[i] +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1+numOfBoxes) +`)
                        `
                        con.query(sql4, function (err, results) {
                            if (err) throw err
                        })
                    }  
                }) 
            }
        }
    })

}

var http = require("http");
setInterval(function() {
    http.get("http://tkstrakonice.herokuapp.com");
}, 900000); // every 15 minutes (900000)




const createDatabase = () => {

    // SPUSTIT POUZE PRI VYTVARENI DATABAZE, NEZAPOMENOUT PO VYTVORENI SMAZAT RADEK SPOUSTICI FUNKCI, createDatabase()

    var yearNow = moment().tz("Europe/Prague").year()
    var weekNow = moment().tz("Europe/Prague").isoWeek()

    const create_tables = `
        DROP TABLE IF EXISTS booked_hours, playing_hours, weeks, hour_options;
        CREATE TABLE weeks (id INT AUTO_INCREMENT PRIMARY KEY, year INT(11), week INT(11), isReset TINYINT(1) DEFAULT 0);
        CREATE TABLE hour_options (id INT(11) PRIMARY KEY, val VARCHAR(255));
        CREATE TABLE booked_hours (id INT AUTO_INCREMENT PRIMARY KEY, valueID INT(11), FOREIGN KEY (valueID) REFERENCES hour_options(id));
        CREATE TABLE playing_hours (id INT AUTO_INCREMENT PRIMARY KEY, valueID INT(11), year INT(11), week INT(11), boxId INT(11), FOREIGN KEY (valueID) REFERENCES hour_options(id));
    `
    con.query(create_tables, function (err, results) {
        if (err) throw err
    })
    
    const insert_hour_options = `
        INSERT INTO hour_options (id, val) VALUES ('0', 'free'), ('1', 'booked');
        INSERT INTO weeks (year, week, isReset) VALUES (`+ yearNow +`, `+ weekNow +`, 0)
    `

    con.query(insert_hour_options, function (err, results) {
        if (err) throw err
    })

    for(var i = 0; i < numOfBoxes; i++) {
        const insert_hours = `
            INSERT INTO booked_hours (valueID)
            VALUES (0);
            INSERT INTO playing_hours (valueID, year, week, boxId)
            VALUES (`+ 0 +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1) +`);
            INSERT INTO playing_hours (valueID, year, week, boxId)
            VALUES (`+ 0 +`, `+ yearNow +`, `+ weekNow +`, `+ (i+1+numOfBoxes) +`)
        `
        con.query(insert_hours, function (err, results) {
            if (err) throw err
        })
    }  
}