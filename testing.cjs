const mailjet = require('node-mailjet').apiConnect('b38cc840683e7de80ea48ecfe450958a', '3d99747beb2a062ab7bb7964ad94b44c');

const request = mailjet
  .post('send', { version: 'v3.1' })
  .request({
    Messages: [
      {
        From: {
          Email: "stockmarketbraude@gmail.com",
          Name: "Your Name",
        },
        To: [
          {
            Email: "r151923@hotmail.com",
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
    console.log("Email sent successfully!");
    console.log("Response:", JSON.stringify(result.body, null, 2));
  })
  .catch((err) => {
    console.error("Failed to send email:");
    console.error("Status code:", err.statusCode);
    console.error("Error message:", err.message);
    if (err.response && err.response.res && err.response.res.text) {
      console.error("Detailed error message:", err.response.res.text);
    }
  });
