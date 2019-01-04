var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/oneness';

mongoose.connect(url, { useNewUrlParser: true }, function (err) {
    if (err) throw err;
    console.log("Connected Sucessfully to database");

});


module.exports = mongoose.connection;
