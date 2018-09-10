const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
var async = require("async");
var http = require('http');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
// var session = require("express-session");
// var nodemailer = require("nodemailer");
// var validator = require("email-validator");
// var fileUpload = require('express-fileupload');
// var expressValidator = require("express-validator");
// var chart = require("chartjs");

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'e_learning',
    multipleStatements: true
});

var sessionStore = new MySQLStore({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'e_learning',
    multipleStatements: true
});
 
app.use(session({
    key: '69Atu22GZTSyDGW4sf4mMJdJ42436gAs',
    secret: '3dCE84rey8R8pHKrVRedgyEjhrqGT5Hz',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true })); 

var dateFormat = require('dateformat');
var now = new Date();

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("Mysql went right");
});

app.set('view engine', 'ejs');

app.use('/js',express.static(__dirname+ '/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname+ '/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname+ '/node_modules/jquery/dist'));
app.use('/css',express.static(__dirname+ '/node_modules/bootstrap/dist/css'));
app.use('/img',express.static(__dirname+ '/node_modules/bootstrap/dist/img'));
app.use('/font',express.static(__dirname+ '/node_modules/bootstrap/dist/font'));


app.post('/login',function(req, res){

    var query = 'SELECT * FROM faculty WHERE email = "'+req.body.email+'" AND password="'+req.body.password+'";';
    db.query(query,function(err,result){
        if (err) throw err;
        if(result.length!=0){
            req.session.userID = result[0].facID;
            console.log("Welcome");
             return res.redirect('/forum');
        }else{
            return res.redirect('/');
        }
        
    });
});


//INSTITUTIONS
app.get('/',function(req, res){
    req.session.userID = null;
    var query = " SELECT * FROM institution ";

    db.query(query,function(err,result){

        if(!!err){
            console.log(err);
    
        }
        res.render('pages/index',{
            siteTitle: "Test",
            pageTitle: "E-Learning Management System",
            items:result
        });
        
    });

});
app.post('/',function(req, res){

    var query = 'BEGIN;';
    query+='INSERT INTO `institution`(instID, directorID, address, name, region, campus) values (0, 0,"'+req.body.address+'","'+req.body.name+'","'+req.body.region+'","'+req.body.campus+'");';
    query+='COMMIT;';

    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/');
    });
});




//SCHOOLS
app.post('/school',function(req, res){

    var query = 'BEGIN;';
    query+='INSERT INTO `school`(schoolID, instID, deanID, name) values (0, '+req.body.id+', 0, "'+req.body.name+'");';
    query+='COMMIT;';

    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/school?id='+req.body.id);
    });
});
app.get('/school', function(req, res) {

    var id = req.query.id;
    var query = "  SELECT * FROM school WHERE school.instID = "+id+"; ";
    var query2 = " SELECT * from institution WHERE instID = "+id+"; ";

    db.query(query, function(err, result1) {
        if(!!err){
            console.log(err);
        }else{
            db.query(query2, function(err2, result2){
                if(!!err2){
                    console.log(err);
                }
                res.render('pages/school', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result1,
                    items2: result2 
                  });
            });
            
        }
        
    });

});


//DEPARTMENT
app.post('/department',function(req, res){

    var query = 'BEGIN;';
    query+='INSERT INTO `department`(deptID, schoolID, chairID, dept_name) values (0, '+req.body.id+', 0, "'+req.body.dept_name+'");';
    query+='COMMIT;';

    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/department?id='+req.body.id);
    });
});
app.get('/department', function(req, res) {

    var id = req.query.id;
    var query2 = "  SELECT * FROM school WHERE schoolID = "+id+"; ";
    var query = " SELECT * from department WHERE department.schoolID = "+id+"; ";

    db.query(query, function(err, result1) {
        if(!!err){
            console.log(err);
        }else{
            db.query(query2, function(err2, result2){
                if(!!err2){
                    console.log(err);
                }
                res.render('pages/department', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result1,
                    items2: result2 
                  });
            });
            
        }
        
    });

});


//PROGRAMS
app.post('/program',function(req, res){

    var query = 'BEGIN;';
    query+='INSERT INTO `program`(programID, deptID, name, degree, subject) values (null, '+req.body.id+',  "'+req.body.name+'", "'+req.body.deg+'", "'+req.body.subj+'");';
    query+='COMMIT;';

    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/program?id='+req.body.id);
    });
});
app.get('/program', function(req, res) {

    var id = req.query.id;
    var query = "  SELECT * FROM program WHERE deptID = "+id+"; ";
    var query2 = " SELECT * from department WHERE deptID = "+id+"; ";

    db.query(query, function(err, result1) {
        if(!!err){
            console.log(err);
        }else{
            db.query(query2, function(err2, result2){
                if(!!err2){
                    console.log(err);
                }
                res.render('pages/program', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result1,
                    items2: result2 
                  });
            });
            
        }
        
    });

});



//COURSES
app.post('/course',function(req, res){

    var query = 'BEGIN;';
    query+='INSERT INTO `course`(courseCode, programID, courseDesc) values (null, '+req.body.id+',  "'+req.body.course_desc+'");';
    query+='COMMIT;';

    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/course?id='+req.body.id);
    });
});
app.get('/course', function(req, res) {

    var id = req.query.id;
    var query2 = "  SELECT * FROM program WHERE programID = "+id+"; ";
    var query = " SELECT * from course WHERE programID = "+id+"; ";

    db.query(query, function(err, result1) {
        if(!!err){
            console.log(err);
        }else{
            db.query(query2, function(err2, result2){
                if(!!err2){
                    console.log(err);
                }
                res.render('pages/course', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result1,
                    items2: result2 
                  });
            });
            
        }
        
    });

});


//SUGGESTEDACT
app.get('/suggestedact', function(req, res) {
    var query = " SELECT * from suggestedactivity WHERE postID = 0; ";

    db.query(query, function(err, result) {
        if(!!err){
            console.log(err);
        }else{
            
                res.render('pages/suggestedact', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result
                   });
        
        }
        
    });
     
});
app.post('/suggestedact',function(req, res){
    var query = 'BEGIN;';
    query+='INSERT INTO `suggestedactivity`(suggActivityID, postID, title, content) values (null, 0, "'+req.body.title+'",  "'+req.body.content+'");';
    query+='COMMIT;';
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/suggestedact');
    });
});
app.get('/deleteact',function(req, res){
    var id = req.query.id;
    var query = 'BEGIN;';
    query+='DELETE FROM suggestedactivity WHERE suggActivityID='+id+';';
    query+='COMMIT;';
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record deleted");
        return res.redirect('/suggestedact');
    });
});
app.get('/editact', function(req, res) {
    var query = " SELECT * from suggestedactivity WHERE suggActivityID = "+req.query.id+"; ";

    db.query(query, function(err, result) {
        if(!!err){
            console.log(err);
        }else{
            
                res.render('pages/manageact', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result
                   });
        
        }
        
    });
     
});
app.post('/updateact',function(req, res){
    var query = " UPDATE suggestedactivity SET title='"+req.body.title+"', content='"+req.body.content+"' WHERE suggActivityID = "+req.body.id+"  ";
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record updated");
        return res.redirect('/suggestedact');
    });
});



//FORUMS
app.get('/forum', function(req, res) {
    if(req.session.userID!=null){
    var query = " SELECT * from discussion LEFT JOIN faculty ON facID = facultyID";
    db.query(query, function(err, result) {
        if(!!err){
            console.log(err);
        }else{
            
                res.render('pages/forum', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result,
                    session: req.session.userID
                   });
        
        }
        
    }); 
    }else{
        return res.redirect('/');
    }
});
app.post('/createforum',function(req, res){
    if(req.session.userID!=null){
    var query = 'BEGIN;';
    query+='INSERT INTO `discussion`(discussionID, facultyID, category, question, description, rating, status, date_added) values (null, '+req.session.userID+', "'+req.body.category+'", "'+req.body.question+'",  "'+req.body.description+'", 0, "Open", CURDATE());';
    query+='COMMIT;';
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/forum');
    });
    }else{
        return res.redirect('/');
    }
});
app.get('/forum_details', function(req, res) {
    if(req.session.userID!=null){
    var query = " SELECT * from discussion LEFT JOIN faculty ON facID = facultyID WHERE discussionID = "+req.query.id;
    var query2 = " SELECT * from comment LEFT JOIN faculty ON faculty.facID = comment.facID WHERE forumID = "+req.query.id+" ORDER BY comment.date_added DESC";

    db.query(query, function(err, result) {
        if(!!err){
            console.log(err);
        }else{
            db.query(query2, function(err, result2) {
                if(!!err){
                    console.log(err);
                }
                res.render('pages/forumdetails', {  
                    siteTitle: "Test", 
                     pageTitle: "E-Learning Management System",
                     items: result,
                     items2: result2,
                     session: req.session.userID
                 });
            });
        }
        
    }); 
    }else{
        return res.redirect('/');
    }
});

app.get('/your_forum', function(req, res) {
    if(req.session.userID!=null){
    var query = " SELECT * from discussion LEFT JOIN faculty ON facID = facultyID WHERE facID="+req.session.userID+" ORDER BY date_added desc ";

    db.query(query, function(err, result) {
        if(!!err){
            console.log(err);
        }else{
            
                res.render('pages/yourforum', {  
                    siteTitle: "Test", 
                    pageTitle: "E-Learning Management System",
                    items: result
                   });
        
        }
        
    }); 
    }else{
        return res.redirect('/');
    }
});
app.post('/markclosed',function(req, res){
    if(req.session.userID!=null){
    var query = " UPDATE discussion SET status='Closed' WHERE discussionID = "+req.body.id+"  ";
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record updated");
        return res.redirect('/forum_details?id='+req.body.id);
    });
    }else{
        return res.redirect('/');
    }
});
app.get('/deleteforum',function(req, res){
    if(req.session.userID!=null){
    var id = req.query.id;
    var query = 'BEGIN;';
    query+='DELETE FROM discussion WHERE discussionID='+id+';';
    query+='COMMIT;';
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record deleted");
        return res.redirect('/your_forum');
    });
    }else{
        return res.redirect('/');
    }
});
app.get('/edit_forum', function(req, res) {
    if(req.session.userID!=null){ 
    var query = " SELECT * from discussion WHERE discussionID = "+req.query.id;
    db.query(query, function(err, result) {
        if(!!err){
            console.log(err);
        }else{
                res.render('pages/editforum', {  
                    siteTitle: "Test", 
                     pageTitle: "E-Learning Management System",
                     items: result
                 });
        }
        
    }); 
    }else{
        return res.redirect('/');
    }
});
app.post('/updateforum', function(req, res) {
    if(req.session.userID!=null){
    var query = " UPDATE discussion SET question='"+req.body.question+"', description='"+req.body.description+"' WHERE discussionID = "+req.body.id+"  ";
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record updated");
        return res.redirect('/forum_details?id='+req.body.id);
    });
    }else{
        return res.redirect('/');
    }
});
//END OF FORUM


//COMMENT
app.post('/comment',function(req, res){
    var query = 'BEGIN;';
    query+='INSERT INTO `comment`(commentID, facID, forumID, comment, rating, date_added) values (null, '+req.session.userID+', "'+req.body.id+'",  "'+req.body.comment+'", 0, CURDATE());';
    query+='COMMIT;';
    db.query(query,function(err,result){
        if (err) throw err;
        console.log("1 record inserted");
        return res.redirect('/forum_details?id='+req.body.id);
    });
});


app.listen('3000',()=>{
    console.log("Server started at port 3000");

});