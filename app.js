//make queries to fetch only that fields which will be needed.

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var nodemailer = require('nodemailer');
var sendmail = require('./public/sendmail');
var newUserMail = require('./public/newUserMail');

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
const defaultImageCommunity = "/Upload/images/defaultCommunity.jpg";

app.use(session({
    secret: 'Goku is the strongest',
    resave: true,
    saveUninitialized: true,
    rolling: true,
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
                _id: result._id,
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

    var _id = req.session.header._id;
    User.findOne({ _id: _id }, function (err, result) {
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

    var _id = req.session.header._id;
    User.findOne({ _id: _id }, function (err, result) {
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


        var _id = req.session.header._id;
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
        var phone = (req.body.phone).trim();
        var city = (req.body.city).trim();
        var interests = req.body.interests;
        if (interests == null) {
            interests = [];
        }
        var journey = (req.body.journey).trim();
        var expectation = (req.body.expectation).trim();

        User.findOneAndUpdate({ _id: _id },
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
    var phone = (req.body.phone).trim();
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
        var to = newUser.email;
        var subject = 'Oneness - User Account Credentials';
        var body = newUserMail(to, newUser.password);
        sendmail(to, subject, body);
    });

    req.session.add = true;
    return res.redirect('/admin/adduser');

});

app.post('/admin/sendmail', authenticate, function (req, res) {

    sendmail(req.body.to, req.body.subject, req.body.body);
    return res.json({ success: true });

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

app.post('/admin/userlist', authenticate, function (req, res) {
    //console.log(req.body);

    var role = req.body.roleFilter;
    var status = req.body.statusFilter;
    var start = parseInt(req.body.start);
    var length = parseInt(req.body.length);
    var order = req.body.order[0];
    var orderby = {};
    var dir;

    var searchStr = req.body.search.value;
    if (req.body.search.value) {
        var regex = new RegExp(req.body.search.value, "i")
        searchStr = { $or: [{ 'email': regex }, { 'city': regex }] };
    }
    else {
        searchStr = {};
    }
    var subquery = {};

    if (role != '') {
        subquery.role = role;
    }

    if (status == "true") {
        subquery.status = true;
    }
    else if (status == "false") {
        subquery.status = false;
    }

    var query = {
        $and: [subquery, searchStr]
    };

    if (order.dir == 'asc') {
        dir = 1;
    }
    else {
        dir = -1;
    }


    if (order.column == '1') {
        orderby.email = dir;
    }
    else if (order.column == '3') {
        orderby.city = dir;
    }
    else if (order.column == '4') {
        orderby.status = dir;
    }
    else if (order.column == '5') {
        orderby.role = dir;
    }
    else {
        orderby.activated = dir;
    }
    //console.log(orderby);

    var recordsTotal = 0;
    var recordsFiltered = 0;
    User.count({}, function (err, c) {
        recordsTotal = c;
        // console.log(c);

        User.count(query, function (err, c) {
            recordsFiltered = c;
            //   console.log(c);
            // console.log(req.body.start);
            // console.log(req.body.length);
            User.find(query, 'email phone city status role activated', { skip: start, limit: length, sort: orderby }, function (err, result) {
                if (err) {
                    // console.log('error while getting results' + err);
                    //return;
                    throw err;
                }

                var data = JSON.stringify({
                    draw: req.body.draw,
                    recordsFiltered: recordsFiltered,
                    recordsTotal: recordsTotal,
                    data: result
                });
                res.send(data);
            });

        });
    });


});

app.post('/admin/updateuser', authenticate, function (req, res) {

    var id = req.body.id;
    var email = req.body.email;
    var oldemail = req.body.oldemail;
    var phone = (req.body.phone).trim();
    var city = (req.body.city).trim();
    var status = req.body.status;
    var role = req.body.role;

    User.findOneAndUpdate({ _id: id }, { email: email, phone: phone, city: city, status: status, role: role }, function (err, result) {
        if (err) throw err;
        if (result) {
            if (oldemail == req.session.header.email) {
                req.session.header.email = email;
                req.session.header.role = role;
                if (role != 'Admin') {
                    req.session.header.state = 'User';
                }

                return res.json({ myupdate: true, success: "User Update Success" });
            }
            else {
                return res.json({ success: "User Update Success" });
            }

        }
        else {
            return res.status(500).send({ error: 'Unable to update' });;
        }

    });



});

app.post('/admin/activation', authenticate, function (req, res) {

    var id = req.body.id;
    var email = req.body.email;
    var activated = req.body.activated;

    User.findOneAndUpdate({ _id: id }, { activated: activated }, function (err, result) {
        if (err) throw err;
        if (result) {
            if (email == req.session.header.email) {
                req.session.header.activated = activated;
                return res.json({ mydeactivate: true, success: "User Activation status updated" });
            }
            else {
                return res.json({ success: "User Activation status updated" });
            }

        }
        else {
            return res.status(500).send({ error: 'Unable to update Activation status' });;
        }

    });


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


app.get('/communityError', authenticate, function (req, res) {
    res.status(404);
    return res.render('community_error');
});


app.get('/community/createcommunity', function (req, res) {

    if (req.session.add == undefined) {
        return res.render('create_community', { header: req.session.header, add: false });
    }
    else {
        delete req.session.add;

        return res.render('create_community', { header: req.session.header, add: true });

    }


});


app.post('/community/createcommunity', authenticate, function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/logout');

        }

        //  console.log('Success in creating community');


        var image;
        if (req.file == undefined) {
            image = defaultImageCommunity;
        }
        else {
            image = imagePath + '/' + req.file.filename;
        }

        var name = (req.body.communityName).trim();
        var description = req.body.communityDescription;
        var rule = req.body.communityMembershipRule;
        var owner = req.session.header._id;
        var newCommunity = new Community({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
            owner: owner,
            rule: rule,
            status: 'Activated',
            image: image,
            dateCreated: new Date(),
            location: 'Not Added',

        });

        newCommunity.save(function (err) {
            if (err) throw err;
            console.log('Community created');
            User.updateOne({ _id: owner },
                { $push: { ownerCommunity: newCommunity._id } }, function (err) {
                    if (err) throw err;

                    console.log('Made Community owner');
                });

        });

        req.session.add = true;
        return res.redirect('/community/createCommunity');

    });

});

app.get('/community/editcommunity/:_id', authenticate, function (req, res) {
    //http://localhost:8000/community/editcommunity/5c32406d5351a106b83a4b94
    var _id = req.params._id;
    Community.findOne({ _id: _id }, function (err, result) {
        if (err) throw err;
        if (result && result.status == 'Activated') {

            if (result.requests.length > 0) {
                return res.render('edit_community', { header: req.session.header, community: result, type: 'Owner', requests: true });
            }
            else {
                return res.render('edit_community', { header: req.session.header, community: result, type: 'Owner', requests: false });

            }

        }
        else {
            return redirect('/communityError');
        }

    });


});

app.post('/community/editcommunity/:_id', authenticate, function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/logout');

        }

        //console.log('Success in creating community');

        var image;
        if (req.file == undefined) {
            image = defaultImageCommunity;
        }
        else {
            image = imagePath + '/' + req.file.filename;
        }

        var _id = req.params._id;
        var name = (req.body.communityName).trim();
        var description = req.body.communityDescription;

        var details = {
            _id: _id,
            name: name,
            description: description,
            image: image,
        }

        if (req.body.communityMembershipRule) {
            details.rule = req.body.communityMembershipRule;
        }


        Community.updateOne({ _id: _id }, details, function (err) {
            if (err) throw err;
            console.log('Community Updated');

        });

        return res.redirect('/community/communityprofile/' + _id);

    });

});


app.get('/testing', function (req, res) {

    if (req.session.add == undefined) {
        return res.render('create_community', { header: req.session.header, add: false });
    }
    else {
        delete req.session.add;

        return res.render('create_community', { header: req.session.header, add: true });

    }


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

    console.log('Server is up and running on port number ' + port);

});

