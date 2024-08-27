const nodemailer = require('nodemailer');
const pug = require('pug');

const MAIL_USER = process.env.MAIL_USER;
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PASS = process.env.MAIL_PASS;

const transport = {
  host: MAIL_HOST,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(transport);

/**
 * 
 * @param {object} data 
 */
exports.sendMail = async(data) => {
    transporter.sendMail({
        to: data.to,
        subject: data.subject,
        from: 'hello@izigo.ng',
        html: pug.renderFile(__dirname + '/../templates/'+ data.fileName, data.data)
    },
    function(err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('Mail sent\n' + JSON.stringify(info));
          return true;
        }
      },
    );
}