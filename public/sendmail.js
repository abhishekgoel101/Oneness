var nodemailer = require('nodemailer');

var sendmail=function(to,password){

    var body=function()
    {
      var str= 'Hello \n\nYou are receiving this because you have been signed up at Oneness .\n\nYour login credentials for the site are:\n\nE-Mail:   '+to+' \n\nPassword: '+password+' \n\nClick this link to login: localhost:8000\/ .\n\nIf you did not request this, please ignore this email .\n\nThanks,\n  -- The Oneness Team\n';

        return str;   
    }

   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rahul.thakur.0312@gmail.com',
      pass: '9878808036'
    }
  });

  
  var mailOptions = {
    from: 'rahul.thakur.0312@gmail.com',
    to: to,
    subject: 'Oneness - User Account Credentials',
    text: body()
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
module.exports=sendmail; 
