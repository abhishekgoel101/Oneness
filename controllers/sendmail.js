var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rahul.thakur.0312@gmail.com',
    pass: '9878808036'
  }
});


var sendmail = function (to, subject, body) {

  var mailOptions = {
    from: 'rahul.thakur.0312@gmail.com',
    to: to,
    subject: subject,
    html: body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);

    } else {
      console.log('Email sent: ' + info.response);
    }

  });

}
module.exports = sendmail; 
