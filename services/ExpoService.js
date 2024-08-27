const axios = require('axios');


exports.sendNotification = async (notification_token, title, message, data) => {
    let config = {
        headers: {
            'Host': 'exp.host',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type':'application/json'
        }
      };
      
    axios.post('https://exp.host/--/api/v2/push/send', {
        to: notification_token,
        sound: 'default',
        title: title,
        body: message,
        data:  data
    }, config).then((resp) => {
        return resp;
    }).catch((err) => {
        return err
    });

}