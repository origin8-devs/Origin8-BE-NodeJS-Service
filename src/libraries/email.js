const SibApiV3Sdk = require('sib-api-v3-sdk');
const { SENDINBLUE_APIKEY } = require('../config');

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = SENDINBLUE_APIKEY;

const sendEmail = (data) => {

  const {
    subject,
    email,
    name,
    otp
  } = data;
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = "<html><body><h4>Your verification code is: {{params.otp}}</h4></body></html>";
  sendSmtpEmail.sender = { name: "John Doe", "email": "no-reply@whoson.com" };
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.params = { otp, subject };
  // console.log("Hi")
  return apiInstance.sendTransacEmail(sendSmtpEmail);
}


const sendSMS = (data) => {

  const {
    otp
  } = data;
  let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

  let sendTransacSms = new SibApiV3Sdk.SendTransacSms();

  sendTransacSms = {
    "sender": "Who's On",
    "recipient": "33483011457",
    "content": "Your verification code is:" + otp,
  };

  return apiInstance.sendTransacSms(sendTransacSms)

}

let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

let sendTransacSms = new SibApiV3Sdk.SendTransacSms();

sendTransacSms = {
  "sender": "string",
  "recipient": "33483011457",
  "content": "string",
};

apiInstance.sendTransacSms(sendTransacSms).then(function (data) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function (error) {
  console.error(error);
});
// console.log( sendSMS( {
//   subject : "Account Verification",
//   email : "makrammhanif@gmail.com",
//   name : "Muhammad Akram",
//   otp : 384847
// }));
module.exports = { sendEmail };
