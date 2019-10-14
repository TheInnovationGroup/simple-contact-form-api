let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let nodemailer = require('nodemailer')

require('dotenv').config()

let form_parser = bodyParser.urlencoded({ extended: false })
let json_parser = bodyParser.json()

let email_settings = {
    host: process.env.SMTP_HOST,
    user:  process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
}

// let service_map = {
//     0: 'Analytics / BI',
//     1: 'Application Development',
//     2: 'Databases / Data Processing',
//     3: 'General Consulting',
//     4: 'Website Design',
//     5: 'Maintenance'
// }

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://lvl-up.tech");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/submit-contact-form', json_parser, function (req, res) {
    
    if (!req.body) return res.sendStatus(400)
    var data = req.body;

    // let services_txt = "\r\n";
    // let services_html = ""
    // for (var i in service_map) {

    //     if (data.services[i]) {
    //         services_txt += "   " + service_map[i] + "\r\n"
    //         services_html += "<li><i>" + service_map[i] + "</i></li>"
    //     }
    // }

    let text = "LevelUP has received a contact request: \r\n"
        + 'Name: ' + data.name + "\r\n"
        + 'Email: ' + data.email + "\r\n"
        + 'Phone: ' + data.phone + "\r\n"
        + 'Company: ' + data.company + "\r\n"
        + 'Budget: ' + data.budget + "\r\n"
        + 'Estimate: ' + data.estimate

    let html = "<h3>LevelUP has received contact request:</h3>"
        + 'Name: ' + data.name + "<br>"
        + 'Email: ' + data.email + "<br>"
        + 'Phone: ' + data.phone + "<br>"
        + 'Company: ' + data.company + "<br>"
        + 'Budget: ' + data.budget + "<br>"
        + 'Estimate: ' + data.estimate

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: email_settings.host,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: email_settings.user, // generated ethereal user
            pass: email_settings.pass // generated ethereal password
        }
    })

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"The Innovation Group" <the-innovation-group@outlook.com>', // sender address
        to: email_settings.user, // list of receivers
        subject: 'Contact request from ' + data.name, // Subject line
        text: text, // plain text body
        html: html // html body
    }

    transporter.sendMail(mailOptions, (error, info) => {
       
        if (error) { return console.log(error) }
        console.log('Message sent: %s', info.messageId)
        res.send({ success: true })
    });
})

app.listen({ port: process.env.PORT }, () => { console.log("Server running on port: " + process.env.PORT)})