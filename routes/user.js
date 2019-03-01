
var moment = require('moment');
var moment = require('moment-timezone');
const bcrypt = require('bcrypt');
var mysql = require('mysql')
const saltRounds = 10;


var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tenis_test2",
  multipleStatements: "true"
});

db.connect(function(err) {
  if (err) throw err
  console.log("Connected!");
})

/* var db = mysql.createConnection({
  host: "eu-cdbr-west-02.cleardb.net",
  user: "bef10cec361e81",
  password: "a1790973",
  database: "heroku_8c4a2b31f479d26",
  multipleStatements: "true"
});

db.connect(function(err) {
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
      
      db = mysql.createConnection(conn.config);
      handleDisconnect(db);
      db.connect();
  });
}

handleDisconnect(db);

exports.home = function(req, res) {


  var user =  req.session.user,
  userId = req.session.userId;
  user_type = req.session.user_type;
  console.log('idecko usera='+userId);
  
  var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

  db.query(sql, function(err, results){
    res.render('main.ejs', {user:user});    
  });
}
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
  message = '';
  error = '';
  keepfname = '';
  keeplname = '';
  keepmob = '';
  keepemail = '';
  keeppass = '';
  if(req.method == "POST"){
    var post  = req.body;
    var name= post.user_name;
    var pass= post.password;
    var fname= post.first_name;
    var lname= post.last_name;
    var mob= post.mob_no;

    if(!name || !pass || !fname || !lname || !mob) {
      error = "Vyplňte prosím všechna pole.";
      keepfname = fname
      keeplname = lname
      keepmob = mob
      keepemail = name
      keeppass = pass
      res.render('signup.ejs')
    } else {

      bcrypt.hash(pass, saltRounds, function(err, hash) {

        var sql = "INSERT INTO `users` (`first_name`,`last_name`,`mob_no`,`email`, `password`, `type`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + hash + "', 'member')";
        console.log(sql)
        db.query(sql, function(err, results) {
          if(err) {
            if(err.errno = 1062) {
              console.log(err)
              error = "Pro tento email už existuje účet.";
              keepfname = fname
              keeplname = lname
              keepmob = mob
              

              res.render('signup.ejs')
            }
            /* throw err  */
          } else {
            console.log(results)

            message = "Váš účet byl úspěšně vytvořen.";
            res.render('signup.ejs',{message: message});
          }
        })
      })
    }

  } else {
     res.render('signup');
  }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
  var message = '';
  var sess = req.session; 


  if(req.method == "POST"){
     var post  = req.body;
     var name= post.user_name;
     var pass= post.password;
    
     var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";     
     console.log(sql)                      
     db.query(sql, function(err, results){  
       console.log(results)    
        /* if(results.length){ */
           req.session.userId = results[0].id;
           req.session.user = results[0];
           console.log(results[0].id);
           res.redirect('/index_admin');
        /* }
        else{
           message = 'Neplatné údaje.';
           res.render('index.ejs',{message: message});
        } */
                
     });
  } else {
     res.render('index.ejs',{message: message});
  }
          
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
          
exports.index_admin = function(req, res, next){
          
  var user =  req.session.user,
  userId = req.session.userId;
  user_type = req.session.user_type;
  console.log('idecko usera='+userId);
  if(userId == null || userId == undefined){
     res.redirect("/login");
     return;
  }
  if(user_type != 'admin'){
     res.redirect("/");
     return;
  }

  var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

  db.query(sql, function(err, results){
     res.render('index_admin.ejs', {user:user});    
  });       
};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.booked_hours = function(req, res, next){
  
  var user =  req.session.user,
  userId = req.session.userId;
  user_type = req.session.user_type;
  console.log('idecko usera='+userId);
  if(userId == null || userId == undefined){
     res.redirect("/login");
     return;
  }
  if(user_type != 'admin'){
     res.redirect("/");
     return;
  }
  
  var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

  db.query(sql, function(err, results){
    res.render('booked_hours.ejs', {user:user});    
  });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
  req.session.destroy(function(err) {
     res.redirect("/login");
    })
  };



  //-----------------------------------------------db requests page functionality----------------------------------------------
            
  exports.update_playing_hours = function(req, res, next){
  
    var user =  req.session.user,
    userId = req.session.userId;
    console.log('idecko usera='+userId);
    if(userId == null || userId == undefined){
       res.redirect("/login");
       return;
    }
  
    year = moment().tz("Europe/Prague").year()
    week =  moment().tz("Europe/Prague").isoWeek()
    const sql = "UPDATE playing_hours SET valueID ='" + req.query.valueID + "' WHERE boxId =" + req.query.id +" AND year = " + year + " AND week = " + week
    db.query(sql, function (err, results) {
        if (err) throw err
        console.log(results)
        res.end(JSON.stringify(sql))
    })
  };

  //-----------------------------------------------db requests page functionality----------------------------------------------
            
  exports.update_booked_hours = function(req, res, next){
  
    var user =  req.session.user,
    userId = req.session.userId;
    console.log('idecko usera='+userId);
    if(userId == null || userId == undefined){
       res.redirect("/login");
       return;
    }
  
    const sql = "UPDATE booked_hours SET valueID ='" + req.query.valueID + "' WHERE boxId =" + req.query.id +";"
    db.query(sql, function (err, results) {
        if (err) throw err
        res.end(JSON.stringify(results))
    })
  };