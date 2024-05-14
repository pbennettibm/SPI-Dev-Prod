const express = require("express");
const morgan = require("morgan");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = 8443;

app.use(express.static(path.join(__dirname, "../build")));
app.use(morgan("combined"));

console.log(process.env.EMAIL_HOST)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/email", (req, res) => {
  const emailRequestBody = req.body;
  let emailMessage = `${emailRequestBody.message}`;
  console.log(emailRequestBody);

  const sendMail = (editedMessage) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const options = {
      from: "brian.carroll25@ethereal.email",
      to: ["brian.carroll25@ethereal.email", "Patrick.Bennett@ibm.com"],
      subject: emailRequestBody.subject,
      text: editedMessage,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: error });
      } else {
        console.log(info);
        return res.status(200).json({ emails: info.envelope.to });
      }
    });
  };

  sendMail(emailMessage);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
