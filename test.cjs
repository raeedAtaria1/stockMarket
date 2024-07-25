const mailjet = require('node-mailjet').connect('b38cc840683e7de80ea48ecfe450958a ', '3d99747beb2a062ab7bb7964ad94b44c');

const request = mailjet
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [
      {
        From: {
          Email: "r151923@hotmail.com",
          Name: "Your Name",
        },
        To: [
          {
            Email: "recipient_email@example.com",
            Name: "Recipient Name",
          },
        ],
        Subject: "Your email subject",
        TextPart: "Hello, this is a simple text email",
        HTMLPart: "<h3>Hello, this is an HTML email</h3><p>This is the body of the email.</p>",
      },
    ],
  });

request
  .then((result) => {
    console.log(result.body);
  })
  .catch((err) => {
    console.error(err.statusCode);
  });
