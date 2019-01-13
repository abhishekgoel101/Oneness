var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'Yahoo',
  auth: {
    user: 'rahulthakur0312@yahoo.com',
    pass: '9878808036'
  }
});


var sendmail = function (to, subject, body) {

  var mailOptions = {
    from: 'rahulthakur0312@yahoo.com',
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
