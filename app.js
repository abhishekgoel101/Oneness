var express= require('express');
var session=require('express-session');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
require('./models/connection');
var app=express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.set('port', process.env.PORT || 8000);
const port=app.get('port');

app.use(session({
    secret:'Goku is the strongest',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:300000}
}));

app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/public1'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var authenticate=function(req,res,next){
    var session=req.session;
    
    if(session.is_logged_in==undefined)
    {
     return res.redirect('/');
    }
    else{
    console.log("valid session");
    }
    return next();
}

app.get('/',function(req,res){
    return res.render('main');
    req.session.is_logged_in=true;
    return res.render('login');
    });
    
app.get('/logina',authenticate,function(req,res){
return res.send('valid');
});    

 app.get('*',function(req,res){
   // req.session.destroy();
   res.status(404);
   res.render('not_found'); 
    
});
app.post('*',function(req,res){

    res.status(404);
   res.render('not_found'); 
});

app.listen(port,function(){

    console.log('Server is up and running on port numner '+ port);

});

