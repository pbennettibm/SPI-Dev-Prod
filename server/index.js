const express = require("express");
const morgan = require("morgan");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
// const upload = multer({ dest: './uploads/' })
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./server/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const port = 8443;

app.use(express.static(path.join(__dirname, "../build")));
app.use(morgan("combined"));
app.use(express.json());

console.log(process.env.EMAIL_HOST);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/email", upload.single("fileUpload"), (req, res) => {
  const emailMessage = req.body;
  const emailFile = req.file;
  console.log(emailMessage, emailFile);

  const sendMail = (fileStream) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let text = `I am having an issue with ${emailMessage.title || "an unknown question"} specific to ${emailMessage.subtitle || "a tool that doesn't appear in the UPS Developer Assistant"}.${emailMessage.subtitle ? "  I read through the wiki's steps and still am unable to fix my problem." : "  I did not read through the wiki's steps as I am asking a question that it doesn't have the answer to currently." }  Here is my issue:

    ${emailMessage.issue}
    
    `;

    if (fileStream) {
      text += `I have attached my code to this email.

      `;
    }

    // text += `Can you please help?`;

    const options = {
      from: "brian.carroll25@ethereal.email",
      to: ["brian.carroll25@ethereal.email"],
      subject: `${emailMessage.title || "Unknown"}-${emailMessage.subtitle || "Unknown"}`,
      text: text,
    };

    if (fileStream) {
      options.attachments = [
        {
          filename: emailFile.originalname,
          content: fileStream,
        },
      ];
    }

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: error });
      } else {
        // console.log(info);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return res
          .status(200)
          .json({ link: nodemailer.getTestMessageUrl(info) });
      }
    });
  };

  let fileStream;

  if (emailFile) {
    fileStream = fs.createReadStream(
      `./server/uploads/${emailFile.originalname}`
    );
  }

  sendMail(fileStream);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
