
var mysql = require('mysql')
const express = require("express");
const fs = require("fs");
var moment = require('moment');
var moment = require('moment-timezone');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes')
var user = require('./routes/user')
var http = require('http')
var path = require('path');
var flash = require('express-flash');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var session = require('express-session');
app.use(session({
    secret: 'ssda42das351sad4qqq13ads5133',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

app.use(flash());


app.use(express.json());

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

/* var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tenis_test2",
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


/* global.db = con */

var PORT = process.env.PORT || 8000;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

        
app.get('/', user.home);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
//app.post('/login', user.login);//call for login post
app.get('/index_admin', user.index_admin);//call for dashboard page after login
app.get('/booked_hours', user.booked_hours);//call for dashboard page after login
app.get('/logout', user.logout);//call for logout

var server = app.listen(PORT, function() {
    console.log('running')
    
    checkWeekValidity()
    /* createPH() */
    /* test() */
})

const test = () => {
    year = moment().tz("Europe/Prague").year()
    week =  moment().tz("Europe/Prague").isoWeek()
    var yearAfterWeek = moment().tz("Europe/Prague").add(7, 'days').year()
    var nextWeek = moment().tz("Europe/Prague").add(7, 'days').isoWeek()

    const sql = `
        SELECT *, ho.val as ho_val, d.val as d_val, h.val as h_val, c.val as c_val
        FROM playing_hours as ph
        JOIN hour_options as ho 
        ON ph.valueID = ho.id 
        JOIN days as d 
        ON ph.day = d.id 
        JOIN hours as h 
        ON ph.hour = h.id 
        JOIN courts as c 
        ON ph.court = c.id 
        WHERE (year = `+ year +` AND week = `+ week +`)
        OR (year = `+ yearAfterWeek +` AND week = `+ nextWeek +`)
    `
    con.query(sql, function (err, results) {
        if (err) throw err
        console.log(results)
    })
}


const createPH = () => {
    var yearNow = moment().tz("Europe/Prague").year()
    var yearBeforeWeek = moment().tz("Europe/Prague").subtract(7, 'days').year()
    var yearAfterWeek = moment().tz("Europe/Prague").add(7, 'days').year()

    var weekNow = moment().tz("Europe/Prague").isoWeek()
    var lastWeek = moment().tz("Europe/Prague").subtract(7, 'days').isoWeek()
    var nextWeek = moment().tz("Europe/Prague").add(7, 'days').isoWeek()

    const sql = "SELECT * FROM days; SELECT * FROM courts; SELECT * FROM hours WHERE activated = 1"

    con.query(sql, function(err, results) {
        if(err) throw err
        console.log(results[0].length)

        for(var x = 0; x < results[0].length; x++) {
            for(var o = 0; o < results[2].length; o++) {
                for(var i = 0; i < results[1].length; i++) {
                    const sql2 = `
                        INSERT INTO playing_hours (year, week, day, court, hour) 
                        VALUES (2019, 9, ` + results[0][x].id + `, ` + results[1][i].id + `, ` + results[2][o].id + `)
                    `
                    con.query(sql2, function(err, results) {
                        if(err) throw err
                    })
                }
            }
        }
        
        for(var x = 0; x < results[0].length; x++) {
            for(var o = 0; o < results[2].length; o++) {
                for(var i = 0; i < results[1].length; i++) {
                    const sql2 = `
                        INSERT INTO playing_hours (year, week, day, court, hour) 
                        VALUES (2019, 10, ` + results[0][x].id + `, ` + results[1][i].id + `, ` + results[2][o].id + `)
                    `

                    con.query(sql2, function(err, results) {
                        if(err) throw err
                    })
                }
            }
        }
    })
}

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


const numOfBoxes = 294;
var week
var year

app.get('/load_colors', function(req, res) {
    year = moment().tz("Europe/Prague").year()
    week =  moment().tz("Europe/Prague").isoWeek()
    var yearAfterWeek = moment().tz("Europe/Prague").add(7, 'days').year()
    var nextWeek = moment().tz("Europe/Prague").add(7, 'days').isoWeek()

    const sql = `
        SELECT *, ho.val as ho_val, d.val as d_val, h.val as h_val, c.val as c_val
        FROM playing_hours as ph
        JOIN hour_options as ho 
        ON ph.valueID = ho.id 
        JOIN days as d 
        ON ph.day = d.id 
        JOIN hours as h 
        ON ph.hour = h.id 
        JOIN courts as c 
        ON ph.court = c.id 
        WHERE (year = `+ year +` AND week = `+ week +`)
        OR (year = `+ yearAfterWeek +` AND week = `+ nextWeek +`) 
        ORDER BY ph.id ASC
    `
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/get_user_type', function(req, res) {
    var sess = req.session;
    res.end(JSON.stringify(sess))
})

app.get('/get_hours_courts_days', function(req, res) {
    const sql = "SELECT * FROM hours WHERE activated = 1; SELECT * FROM courts; SELECT * FROM days"

    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.post('/login', function(req, res) {
    var message = '';
    var sess = req.session; 

    if(req.method == "POST"){
        var post  = req.body;
        var email= post.email;
        var pass= post.password;
        
        /* var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+ hash +"'"; */     
        var sql="SELECT id, first_name, last_name, password, type FROM `users` WHERE `email`='"+email+"'";     
        console.log(sql)                      
        con.query(sql, function(err, results){  
            console.log(results)    
            if(results.length){
                bcrypt.compare(pass, results[0].password, function(err, res2) {
                    if(res2) {  
                        req.session.userId = results[0].id;
                        req.session.user_type = results[0].type;
                        req.session.user = results[0];
                        console.log(results[0].id);

                        if(results[0].type == "admin") {
                            res.redirect('/index_admin');
                        } else if(results[0].type == "member") {
                            res.redirect('/');
                        } else {
                            res.redirect('/');
                        }
                    }
                    else{
                        message = 'Neplatné heslo.';
                        res.render('index.ejs',{message: message});
                    }
                })
            }
            else{
                message = 'Neplatný email.';
                res.render('index.ejs',{message: message});
            }
                    
        });

    } else {
        res.render('index.ejs',{message: message});
    }
      
})

app.get('/check_court_status', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    
    var hours = []
    var numOfHours = parseInt(req.query.bookHoursNum)
    var lastDay = parseInt(req.query.dayId)
    var lastCourt = parseInt(req.query.courtId)
    var lastHour = parseInt(req.query.hourId)
    var hours_ids = req.query.hoursIds.split(',')
    
    for(var i = 0; i < numOfHours; i++) {
        hours[i] = hours_ids[i + lastHour]
    }
    
    const sql = "SELECT * FROM playing_hours WHERE year = " + req.query.year + " AND week = " + req.query.week + " AND day = " + lastDay + " AND court = " + lastCourt + " AND hour IN (" + hours +  ") AND valueID = 0"           
    
    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/book_court', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }

    var hours = []
    var numOfHours = parseInt(req.query.bookHoursNum)
    var lastDay = parseInt(req.query.dayId)
    var lastCourt = parseInt(req.query.courtId)
    var lastHour = parseInt(req.query.hourId)
    var hours_ids = req.query.hoursIds.split(',')
    
    for(var i = 0; i < numOfHours; i++) {
        hours[i] = hours_ids[i + lastHour]
    }

    const sql = "UPDATE playing_hours SET valueID = 1, booked_by =" + req.session.userId + ", booked_time ='" + req.query.booked_time + "', note='" + req.query.note +"', start_id=" + req.query.start_id + ", length=" + numOfHours + " WHERE year = " + req.query.year + " AND week = " + req.query.week + " AND day = " + lastDay + " AND court = " + lastCourt + " AND hour IN (" + hours +  ") AND valueID = 0" 
    
    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/hour_details', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    if(user.id != req.query.userId && user.type != 'admin'){
       res.redirect("/");
       return;
    }
    
    var lastDay = parseInt(req.query.dayId)
    var lastCourt = parseInt(req.query.courtId)
    var lastHour = parseInt(req.query.hourId)
    
    const sql = "SELECT *, users.id as id2 FROM playing_hours JOIN users ON booked_by = users.id WHERE year = " + req.query.year + " AND week = " + req.query.week + " AND day = " + lastDay + " AND court = " + lastCourt + " AND hour=" + lastHour           
    
    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/cancel_reservation', function(req, res) {
    var user =  req.session.user
    if(!user){
        res.redirect("/login");
        return;
    }
    if(user.id != req.query.userId && user.type != 'admin'){
       res.redirect("/");
       return;
    }
    

    var user =  req.session.user,
    userId = req.session.userId;
    console.log('idecko usera='+ user);
    if(userId == null || userId == undefined){
       res.redirect("/login");
       return;
    }
    
    const sql = "UPDATE playing_hours SET valueID = 0, booked_by = '1', booked_time = '', note= '' WHERE year = " + req.query.year + " AND week = " + req.query.week + " AND start_id='" + req.query.start_id + "' AND valueID = 1"     
    
    con.query(sql, function(err, results) {
        if (err) throw err
        console.log('whaaat' + results)
        res.end(JSON.stringify(results))
    })
})


app.get('/load_colors_booked', function(req, res) {

    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    if(user.type != 'admin'){
       res.redirect("/");
       return;
    }

    const sql = `
        SELECT *, ho.val as ho_val, d.val as d_val, h.val as h_val, c.val as c_val
        FROM booked_hours as bh
        JOIN hour_options as ho 
        ON bh.valueID = ho.id 
        JOIN days as d 
        ON bh.day = d.id 
        JOIN hours as h 
        ON bh.hour = h.id 
        JOIN courts as c 
        ON bh.court = c.id 
        ORDER BY bh.id ASC
    `   
    con.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/check_court_status_booked', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    if(user.type != 'admin'){
       res.redirect("/");
       return;
    }

    var hours = []
    var numOfHours = parseInt(req.query.bookHoursNum)
    var lastDay = parseInt(req.query.dayId)
    var lastCourt = parseInt(req.query.courtId)
    var lastHour = parseInt(req.query.hourId)
    var hours_ids = req.query.hoursIds.split(',')

    for(var i = 0; i < numOfHours; i++) {
        hours[i] = hours_ids[i + lastHour]
    }
    
    const sql = "SELECT * FROM booked_hours WHERE day = " + lastDay + " AND court = " + lastCourt + " AND hour IN (" + hours +  ") AND valueID = 0"           
    console.log(sql)
    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/book_court_booked', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    if(user.type != 'admin'){
       res.redirect("/");
       return;
    }

    var hours = []
    var numOfHours = parseInt(req.query.bookHoursNum)
    var lastDay = parseInt(req.query.dayId)
    var lastCourt = parseInt(req.query.courtId)
    var lastHour = parseInt(req.query.hourId)
    var hours_ids = req.query.hoursIds.split(',')

    for(var i = 0; i < numOfHours; i++) {
        hours[i] = hours_ids[i + lastHour]
    }

    const sql = "UPDATE booked_hours SET valueID = 1, booked_by =" + req.session.userId + ", booked_time ='" + req.query.booked_time + "', note='" + req.query.note +"', start_id=" + req.query.start_id + ", length=" + numOfHours + " WHERE day = " + lastDay + " AND court = " + lastCourt + " AND hour IN (" + hours +  ") AND valueID = 0" 
    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/hour_details_booked', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    if(user.type != 'admin'){
       res.redirect("/");
       return;
    }

    var lastDay = parseInt(req.query.dayId)
    var lastCourt = parseInt(req.query.courtId)
    var lastHour = parseInt(req.query.hourId)
    
    const sql = "SELECT *, users.id as id2 FROM booked_hours JOIN users ON booked_by = users.id WHERE day = " + lastDay + " AND court = " + lastCourt + " AND hour=" + lastHour           

    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})

app.get('/cancel_reservation_booked', function(req, res) {
    var user =  req.session.user
    if(!user){
       res.redirect("/login");
       return;
    }
    if(user.type != 'admin'){
       res.redirect("/");
       return;
    }

    const sql = "UPDATE booked_hours SET valueID = 0, booked_by = '1', booked_time = '', note= '' WHERE start_id='" + req.query.start_id + "' AND valueID = 1"     

    con.query(sql, function(err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
})


const checkWeekValidity = () => {
    var yearNow = moment().tz("Europe/Prague").year()
    var yearBeforeWeek = moment().tz("Europe/Prague").subtract(7, 'days').year()
    var yearAfterWeek = moment().tz("Europe/Prague").add(7, 'days').year()

    var weekNow = moment().tz("Europe/Prague").isoWeek()
    var lastWeek = moment().tz("Europe/Prague").subtract(7, 'days').isoWeek()
    var nextWeek = moment().tz("Europe/Prague").add(7, 'days').isoWeek()
    
    var valuesWeek2 = []
    var valuesBooked = []

    const sql = "SELECT * FROM weeks WHERE year = " + yearNow + " AND week = " + weekNow + "; SELECT * FROM weeks WHERE year = " + yearAfterWeek + " AND week = " + nextWeek
    con.query(sql, function (err, results) {
        if (err) throw err

        if(results[0].length == 0) {

            const sql2 = "SELECT * FROM booked_hours; INSERT INTO weeks (year, week) VALUES ('" + yearNow + "', '" + weekNow + "'), ('" + yearAfterWeek + "', '" + nextWeek + "') "
            con.query(sql2, function(err, results) {
                if(err) throw err

                for(var x = 0; x < results[0].length; x++) {
                    const sql3 = `
                        INSERT INTO playing_hours (year, week, day, court, hour, valueID, booked_by, booked_time, note, start_id, length, isPaid) 
                        VALUES (` + yearNow + `, ` + weekNow + `, ` + results[0][x].day + `, ` + results[0][x].court + `, ` + results[0][x].hour + `, ` + results[0][x].valueID + `, ` + results[0][x].booked_by + `, '` + results[0][x].booked_time + `', '` + results[0][x].note + `', ` + results[0][x].start_id + `, ` + results[0][x].length + `, 1)
                    `
                    con.query(sql3, function(err, results) {
                        if(err) throw err
                        
                    })
                }

                for(var x = 0; x < results[0].length; x++) {
                    const sql3 = `
                    INSERT INTO playing_hours (year, week, day, court, hour, valueID, booked_by, booked_time, note, start_id, length, isPaid)  
                        VALUES (` + yearAfterWeek + `, ` + nextWeek + `, ` + results[0][x].day + `, ` + results[0][x].court + `, ` + results[0][x].hour + `, ` + results[0][x].valueID + `, ` + results[0][x].booked_by + `, '` + results[0][x].booked_time + `', '` + results[0][x].note + `', ` + results[0][x].start_id + `, ` + results[0][x].length + `, 1)
                    `
                    con.query(sql3, function(err, results) {
                        if(err) throw err
                        
                    })
                }
            })
            
        } else if(results[1].length == 0) {

            const sql2 = "SELECT * FROM booked_hours; INSERT INTO weeks (year, week) VALUES ('" + yearAfterWeek + "', '" + nextWeek + "') "
            con.query(sql2, function(err, results) {
                if(err) throw err

                console.log(results[0])
                for(var x = 0; x < results[0].length; x++) {
                    const sql3 = `
                        INSERT INTO playing_hours (year, week, day, court, hour, valueID, booked_by, booked_time, note, start_id, length, isPaid) 
                        VALUES (` + yearAfterWeek + `, ` + nextWeek + `, ` + results[0][x].day + `, ` + results[0][x].court + `, ` + results[0][x].hour + `, ` + results[0][x].valueID + `, ` + results[0][x].booked_by + `, '` + results[0][x].booked_time + `', '` + results[0][x].note + `', ` + results[0][x].start_id + `, ` + results[0][x].length + `, 1)
                    `
                    console.log(sql3)
                    con.query(sql3, function(err, results) {
                        if(err) throw err

                    })
                }
            })
        }

        setTimeout(function() {
            checkWeekValidity()
        }, 1000*60*5)
    })

}


setInterval(function() {
    http.get("http://tkstrakonice.herokuapp.com");
}, 900000); // every 15 minutes (900000)




const createDatabase = () => {

    // SPUSTIT POUZE PRI VYTVARENI DATABAZE, NEZAPOMENOUT PO VYTVORENI SMAZAT RADEK SPOUSTICI FUNKCI, createDatabase()

    var yearNow = moment().tz("Europe/Prague").year()
    var weekNow = moment().tz("Europe/Prague").isoWeek()

    const create_tables = `
        DROP TABLE IF EXISTS booked_hours, playing_hours, weeks, hour_options, users;
        CREATE TABLE weeks (id INT AUTO_INCREMENT PRIMARY KEY, year INT(11), week INT(11), isReset TINYINT(1) DEFAULT 0);
        CREATE TABLE hour_options (id INT(11) PRIMARY KEY, val VARCHAR(255));
        CREATE TABLE booked_hours (id INT AUTO_INCREMENT PRIMARY KEY, valueID INT(11), boxId INT(11), FOREIGN KEY (valueID) REFERENCES hour_options(id));
        CREATE TABLE playing_hours (id INT AUTO_INCREMENT PRIMARY KEY, valueID INT(11), year INT(11), week INT(11), boxId INT(11), FOREIGN KEY (valueID) REFERENCES hour_options(id));
        CREATE TABLE users (id int(5) NOT NULL AUTO_INCREMENT, first_name text NOT NULL, last_name text NOT NULL, mob_no int(11) NOT NULL, user_name varchar(20) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;
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
            INSERT INTO booked_hours (valueID, boxId)
            VALUES (0, `+ (i+1) +`);
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


/* CREATE TABLE `booked_hours` (
  `id` int(11) NOT NULL,
  `valueID` int(11) DEFAULT '0',
  `day` int(11) NOT NULL,
  `hour` int(11) NOT NULL,
  `court` int(11) NOT NULL,
  `boxId` int(11) DEFAULT NULL,
  `booked_by` int(11) DEFAULT '1',
  `booked_time` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `note` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `start_id` int(11) NOT NULL,
  `length` int(11) NOT NULL,
  `isPaid` tinyint(1) DEFAULT NULL
) */

/* CREATE TABLE `playing_hours` (
    `id` int(11) NOT NULL,
    `valueID` int(11) DEFAULT '0',
    `year` int(11) DEFAULT NULL,
    `week` int(11) DEFAULT NULL,
    `day` int(11) NOT NULL,
    `hour` int(11) NOT NULL,
    `court` int(11) NOT NULL,
    `boxId` int(11) DEFAULT NULL,
    `booked_by` int(11) DEFAULT '1',
    `booked_time` varchar(255) COLLATE utf8_czech_ci NOT NULL,
    `note` varchar(255) COLLATE utf8_czech_ci NOT NULL,
    `start_id` int(11) NOT NULL,
    `length` int(11) NOT NULL,
    `isPaid` tinyint(1) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci; */


  // chybi PRIMARY/FOREIGN KEYS, nejlepe export- otevrit sql file, zkopirovat thaaanx
