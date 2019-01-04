var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var sendmail = require('./public/sendmail');

var mongoose = require('mongoose');
require('./models/connection');
var User = require('./models/user');
var Community = require('./models/community');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8000);
const port = app.get('port');
const imagePath = "/Upload/images";

app.use(session({
    secret: 'Goku is the strongest',
    resave: true,
    saveUninitialized: true,
    // rolling:true,
    cookie: { maxAge: 300000 }
}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public1'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var authenticate = function (req, res, next) {
    var session = req.session;

    if (session.is_logged_in == undefined) {
        return res.redirect('/');
    }
    else if (session.header.activated == false && req.path != '/deactivated') {
        return res.redirect('/deactivated');
    }
    else if (session.header.status == false && req.path != '/editProfile' && req.path != '/logout') {

        return res.redirect('/editProfile');
    }
    else if (session.header.role != 'Admin' && (req.path).startsWith('/admin')) {
        return res.redirect('/noPermission');
    }
    else {
    }
    return next();
    //add track previous route to redirect
}
//check if logged in true and user requests / page send him next page(profile page automatically)

var redirectHome = function (req, res, next) {

    if (req.session.is_logged_in == true) {
        //if admin
        return res.redirect('/profile');
        //else redirect user 

    }
    else {
    }
    return next();


}


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public" + imagePath);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage }).single('profilePhoto');



app.get('/', redirectHome, function (req, res) {

    if (req.session.incorrect == undefined) {
        return res.render('login', { incorrect: false });
    }
    else {
        delete req.session.incorrect;
        return res.render('login', { incorrect: true });
    }
});

app.post('/', redirectHome, function (req, res) {

    var email = req.body.username;
    email = email.toLowerCase();
    var password = req.body.password;

    User.findOne({ email: email, password: password }, function (err, result) {
        if (err) throw err;
        if (result) {

            req.session.is_logged_in = true;
            var state;
            if (result.role == 'Admin') {
                state = 'Admin';
            }
            else {
                state = 'User';
            }

            req.session.header = {
                email: result.email,
                name: result.name,
                role: result.role,
                image: result.image,
                state: state,
                status: result.status,
                activated: result.activated,

            }
            //render admin page to admin and user page to user.
            return res.redirect('/profile');

        }
        else {
            req.session.incorrect = true;
            return res.redirect('/');
        }

    });

});


app.get('/profile', authenticate, function (req, res) {

    var email = req.session.header.email;
    User.findOne({ email: email }, function (err, result) {
        if (err) throw err;
        if (result) {

            return res.render('profile', { header: req.session.header, user: result });

        }
        else {
            return res.redirect('/logout');
        }

    });


});


app.get('/editProfile', authenticate, function (req, res) {

    var email = req.session.header.email;
    User.findOne({ email: email }, function (err, result) {
        if (err) throw err;
        if (result) {

            return res.render('edit_profile', { header: req.session.header, user: result });

        }
        else {
            return res.redirect('/logout');
        }

    });


});



app.post('/editProfile', authenticate, function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/logout');

        }

        console.log('Success in profile editing');


        var email = req.session.header.email;
        var image;
        if (req.file == undefined) {
            image = req.session.header.image;
        }
        else {
            image = imagePath + '/' + req.file.filename;
        }

        var name = (req.body.name).trim();

        var dob_array = (req.body.dob).split("/");
        var dob = new Date(dob_array[2], dob_array[1] - 1, dob_array[0]);

        var gender = req.body.gender;
        var phone = parseInt(req.body.phone);
        var city = (req.body.city).trim();
        var interests = req.body.interests;
        if (interests == null) {
            interests = [];
        }
        var journey = (req.body.journey).trim();
        var expectation = (req.body.expectation).trim();

        User.findOneAndUpdate({ email: email },
            {
                image: image, name: name, dob: dob, gender: gender, phone: phone, city: city, interests: interests, journey: journey, expectation: expectation, status: true
            },
            function (err, result) {
                if (err) throw err;
                if (result) {
                    req.session.header.name = result.name;
                    req.session.header.image = result.image;
                    req.session.header.status = true;

                    return res.redirect('/profile');

                }
                else {
                    return res.redirect('/logout');
                }

            });


    });

});

app.get('/admin/adduser', authenticate, function (req, res) {

    if (req.session.add == undefined) {
        return res.render('adduser', { header: req.session.header, add: false });
    }
    else {
        delete req.session.add;
        return res.render('adduser', { header: req.session.header, add: true });
    }

});

app.post('/admin/adduser', authenticate, function (req, res) {

    var email = req.body.username;
    var phone = parseInt(req.body.phone);
    var city = (req.body.city).trim();
    var password = req.body.password;
    var role = req.body.roleoptions;

    var newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
        name: "",
        role: role,
        status: false,
        activated: true,
        gender: 'Male',
        phone: phone,
        city: city,
        image: imagePath + '/default.png'
    });

    newUser.save(function (err) {
        if (err) throw err;
        console.log('User created');
        sendmail(newUser.email, newUser.password);
    });

    req.session.add = true;
    return res.redirect('/admin/adduser');

});


app.post('/admin/checkuser', authenticate, function (req, res) {

    var email = req.body.username;

    User.findOne({ email: email }, function (err, result) {
        if (err) throw err;
        if (result) {
            return res.json({ valid: false });
        }
        else {
            return res.json({ valid: true });
        }

    });


});

app.get('/admin/switchState/:state', authenticate, function (req, res) {

    req.session.header.state = req.params.state;
    return res.redirect('/profile');

});

app.get('/admin/userlist', authenticate, function (req, res) {

    return res.render('user_list', { header: req.session.header });

});


app.get('/changePassword', authenticate, function (req, res) {

    var invalidPassword;
    if (req.session.invalidPassword == undefined) {
        invalidPassword = undefined;
    }
    else {
        invalidPassword = req.session.invalidPassword;
        delete req.session.invalidPassword;

    }
    return res.render('change_password', { header: req.session.header, invalidPassword: invalidPassword });

});


app.post('/changePassword', authenticate, function (req, res) {

    var email = req.session.header.email;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    User.findOneAndUpdate({ email: email, password: oldPassword }, { password: newPassword }, function (err, result) {
        if (err) throw err;
        if (!result) {
            req.session.invalidPassword = true;
        }
        else {
            req.session.invalidPassword = false;

        }

        return res.redirect('/changePassword');


    });


});


app.get('/logout', authenticate, function (req, res) {

    req.session.destroy();
    return res.redirect('/');

});

app.get('/deactivated', authenticate, function (req, res) {

    req.session.destroy();
    return res.render('deactivated');

});


app.get('/noPermission', authenticate, function (req, res) {
    res.status(401);
    return res.render('no_permission');
});

app.get('*', function (req, res) {

    res.status(404);
    return res.render('not_found');

});
app.post('*', function (req, res) {

    res.status(404);
    return res.render('not_found');
});

app.listen(port, function () {

    console.log('Server is up and running on port numner ' + port);

});

