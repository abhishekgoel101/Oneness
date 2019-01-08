var prepareMail = function (email, password) {
    var str = '<p>Hello ,<br /><br />You are receiving this because you have been signed up as at Oneness .<br /><br />Your login credentials for the site are:<br /><br />E-Mail:&nbsp; &nbsp;<a href="mailto:' + email + '" target="_blank">' + email + '</a>&nbsp;<br /><br />Password:' + password + '<br /><br />Click this link to login:&nbsp;<a href="http://localhost:8000/" target="_blank" rel="noreferrer">localhost:8000/</a>&nbsp;.<br /><br />If you did not request this, please ignore this email.<br /><br />Thanks,<br />&nbsp; -- The Oneness Team</p>'
    return str;
}

module.exports = prepareMail;