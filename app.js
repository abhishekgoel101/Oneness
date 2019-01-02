var express= require('express');
var session=require('express-session');
var bodyParser=require('body-parser');
var nodemailer = require('nodemailer');
var sendmail=require('./public/data/sendmail');

var mongoose=require('mongoose');
require('./models/connection');
var User=require('./models/user');
var Community=require('./models/community');
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
    }
    return next();
    //add track previous route to redirect
}
//check if logged in true and user requests / page send him next page(profile page automatically)

var redirectHome=function(req,res,next){
    
    if(req.session.is_logged_in==true)
    {
        //if admin
     return res.redirect('/admin/adduser');
     //else redirect user 

    }
    else{
    }
    return next();


}

app.get('/',redirectHome,function(req,res){
    
    if(req.session.incorrect==undefined)
    {
        return res.render('login',{incorrect:false});
    }
    else{
    delete req.session.incorrect;
    return res.render('login',{incorrect:true});
    }
});

app.post('/',redirectHome,function(req,res){

        var email=req.body.username;
        var password=req.body.password;

        User.findOne({email:email,password:password},function(err,result){
            if(err) throw err;
            if(result)
            {
                req.session.is_logged_in=true;
                req.session.user_name=result.name;
                req.session.user_role=result.role;
                req.session.user_image=result.image;
 //render admin page to admin and user page to user.
                return res.redirect('/admin/adduser');                           

            }
            else
            {
            req.session.incorrect=true;    
            return res.redirect('/');
            }

        });



})    
    
app.get('/admin/adduser',authenticate,function(req,res){
    
    if(req.session.add==undefined)
    {return res.render('adduser',{add:false});}
    else
    {   delete req.session.add;
        return res.render('adduser',{add:true});}
    
    });
app.post('/admin/checkuser',authenticate,function(req,res){

    var email=req.body.username;

    User.findOne({email:email},function(err,result){
        if(err) throw err;
        if(result)
        {
         return res.json({valid:false});   
        }
        else
        {
            return res.json({valid:true});       
        }

    });



});    

app.post('/admin/adduser',authenticate,function(req,res){

    var email=req.body.username;
    var phone=parseInt(req.body.phone);    
    var city=req.body.city;
    var password=req.body.password;
    var role=req.body.roleoptions;
  
    var newUser= new User({
        _id: new mongoose.Types.ObjectId(),
        email:email,
        password:password,
        name:"",
        role:role,
        status:false,
        activated:true,
        gender:'Male',
        phone:phone,
        city:city,
    });

    newUser.save(function(err){
        if(err) throw err;
        console.log('User created');
        sendmail(newUser.email,newUser.password);
    });

    req.session.add=true;
    return res.redirect('/admin/adduser');

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

