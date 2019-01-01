var express= require('express');
var session=require('express-session');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var app=express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.set('port',process.env.PORT||8000);

app.use(session({
    secret:'Goku is the strongest',
    cookie:{maxAge:300000}
}));

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.listen(app.get('port'),function(){

    console.log('Server is up and running on port numner '+ app.get('port'));

});

