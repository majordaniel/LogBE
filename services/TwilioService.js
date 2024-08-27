var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

/**
 * 
 * @param {string} text 
 * @param {*} phone 
 */
exports.sendMessage = async(text, phone) => {
    return await client.messages.create({
        body: text,
        to: phone,  // Text this number
        from: 'Izigo Logistics' // From a valid Twilio number
    });
}