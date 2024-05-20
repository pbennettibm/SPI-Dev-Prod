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

    let text = `The developer is having an issue with ${emailMessage.title || "a question outside of what the UPS Developer Assistant is able to handle"} specific to ${emailMessage.subtitle || "an unknown tool"}.${emailMessage.subtitle ? "  They read through the wiki's steps and are still unable to fix their problem." : "  They did not read through the wiki's steps as they are asking a question that it doesn't have the answer to currently." }  Here is the developer's issue:

    ${emailMessage.issue}
    
    `;

    if (fileStream) {
      text += `The developer has also attached the code they are having an issue with to this email.

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
