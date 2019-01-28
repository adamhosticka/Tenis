
var moment = require('moment');
var moment = require('moment-timezone');

var mysql = require('mysql')
var db = mysql.createConnection({
  host: "eu-cdbr-west-02.cleardb.net",
  user: "bef10cec361e81",
  password: "a1790973",
  database: "heroku_8c4a2b31f479d26",
  multipleStatements: "true"
});

db.connect(function(err) {
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
      
      db = mysql.createConnection(conn.config);
      handleDisconnect(db);
      db.connect();
  });
}

handleDisconnect(db);

exports.home = function(req, res) {
  res.render('main.ejs')
}
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
  message = '';
  if(req.method == "POST"){
     var post  = req.body;
     var name= post.user_name;
     var pass= post.password;
     var fname= post.first_name;
     var lname= post.last_name;
     var mob= post.mob_no;

     var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

     var query = db.query(sql, function(err, result) {

        message = "Váš účet byl úspěšně vytvořen.";
        res.render('signup.ejs',{message: message});
     });

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
  console.log('idecko usera='+userId);
  if(userId == null || userId == undefined){
     res.redirect("/login");
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
  console.log('idecko usera='+userId);
  if(userId == null || userId == undefined){
    res.redirect("/login");
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