const nodemailer = require('nodemailer')
const { google} = require('googleapis')
const { OAuth2} = google.auth;
const OAuth_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const  {
    MAILING_SERVIICE_CLIENT_ID,
    MAILING_SERVIICE_CLIENT_SECRET,
    MAILING_SERVIICE_REFRESH_TOKEN,
    SENDER_MAIL_ADDRESS
} = process.env;
console.log("Maile id :",MAILING_SERVIICE_CLIENT_ID);
console.log("Maile id :","747275520406-n7b1rtokjlb11tgrtop77r3nsjheonip.apps.googleusercontent.com");

console.log("Secret :",MAILING_SERVIICE_CLIENT_SECRET);
console.log("Secret :","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");

// const oauthClient2 = new OAuth2({    
//     MAILING_SERVIICE_CLIENT_ID,
//     MAILING_SERVIICE_CLIENT_SECRET,
//     MAILING_SERVIICE_REFRESH_TOKEN,
//     OAuth_PLAYGROUND
// })

const oauthClient2 = new OAuth2({
    clientId: MAILING_SERVIICE_CLIENT_ID,
    clientSecret: MAILING_SERVIICE_CLIENT_SECRET,
    redirectUri: undefined,
    credentials: {
        refresh_token: MAILING_SERVIICE_REFRESH_TOKEN
    }
});


const sendMail = (to , url , txt) =>{
    oauthClient2.setCredentials({
        refresh_token: MAILING_SERVIICE_REFRESH_TOKEN
    })
    const accessToken = oauthClient2.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            type : 'OAuth2',
            user :SENDER_MAIL_ADDRESS,
            clientId : MAILING_SERVIICE_CLIENT_ID,
            clientSecret :MAILING_SERVIICE_CLIENT_SECRET,
            refreshToken : MAILING_SERVIICE_REFRESH_TOKEN,
            accessToken 
        }
    })
    const mailOptions = {
        from : SENDER_MAIL_ADDRESS,
        to : to,
        subject :  "Yeysy boy",
        html : `
        <div style="max-width: 600px; margin: auto; border: 8px solid #3498db; padding: 40px 20px; font-size: 120%; background-color: #ecf0f1; border-radius: 10px;">
    <h2 style="text-align: center; text-transform: uppercase; color: #2c3e50;">Welcome to the MyApp Community!</h2>
    <p>Congratulations! You're almost ready to start enjoying all the features of Yeysy tools✨. Simply click the button below to verify your email address.</p>
    
    <a href="${url}" style="background: #e74c3c; text-decoration: none; color: #fff; padding: 12px 24px; margin: 20px 0; display: inline-block; border-radius: 5px;">${txt}</a>
    
    <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
    <div style="font-weight: bold; color: #3498db;">${url}</div>
</div>

        `
    }
    smtpTransport.sendMail(mailOptions ,  (err, information) =>{
        if(err) return err;
        console.log("sent mail");
        return information;
    })
}

module.exports = sendMail