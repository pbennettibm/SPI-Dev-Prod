const express = require("express");
const morgan = require("morgan");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const session = require("express-session");
const passport = require("passport");
const appID = require("ibmcloud-appid");
var maintenence = require("./maintenence/alerts.json");
dotenv.config();

let port;

console.log("node_env", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "staging") {
  port = 3000;
} else {
  port = 8443;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./server/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const WebAppStrategy = appID.WebAppStrategy;

const CALLBACK_URL = "/ibm/cloud/appid/callback";

app.use(express.static(path.join(__dirname, "../landing")));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup express application to use express-session middleware
// Must be configured with proper session storage for production
// environments. See https://github.com/expressjs/session for
// additional documentation
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    proxy: true,
  })
);

// Configure express application to use passportjs
app.use(passport.initialize());
app.use(passport.session());

let webAppStrategy;

if (process.env.NODE_ENV !== "staging") {
  webAppStrategy = new WebAppStrategy({
    clientId: process.env.CLIENT_ID,
    oauthServerUrl: process.env.OAUTH_SERVER_URL,
    profilesUrl: process.env.PROFILES_URL,
    secret: process.env.APP_ID_SECRET,
    tenantId: process.env.TENANT_ID,
    redirectUri: "http://localhost:3000/ibm/cloud/appid/callback",
  });
} else {
  webAppStrategy = new WebAppStrategy({
    clientId: process.env.CLIENT_ID,
    oauthServerUrl: process.env.OAUTH_SERVER_URL,
    profilesUrl: process.env.PROFILES_URL,
    secret: process.env.APP_ID_SECRET,
    tenantId: process.env.TENANT_ID,
    redirectUri: process.env.REDIRECT_URI,
  });
}

passport.use(webAppStrategy);

// Configure passportjs with user serialization/deserialization. This is required
// for authenticated session persistence accross HTTP requests. See passportjs docs
// for additional information http://passportjs.org/docs
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Callback to finish the authorization process. Will retrieve access and identity tokens/
// from AppID service and redirect to either (in below order)
// 1. the original URL of the request that triggered authentication, as persisted in HTTP session under WebAppStrategy.ORIGINAL_URL key.
// 2. successRedirect as specified in passport.authenticate(name, {successRedirect: "...."}) invocation
// 3. application root ("/")
app.get(
  CALLBACK_URL,
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    failureRedirect: "/error",
    session: false,
  })
);

app.get("/healthcheck", (req, res) => {
  res.send("Healthy!");
});

app.get("/outage", (req, res) => {
  const typeMessage = req.query.type;

  const todaysDate = new Date().getTime();

  console.log(typeMessage, maintenence[typeMessage]);

  if (typeMessage) {
      let date1 = new Date(maintenence[typeMessage].start);
      let date2 = new Date(maintenence[typeMessage].end);

      console.log("today", todaysDate, "first", date1, "last", date2);
      console.log();

      let readableStartDate = date1.toLocaleString("default", {
        month: "long",
      });
      readableStartDate += ` ${date1.getDate()}, ${date2.getFullYear()}`;

      let readableEndDate = date2.toLocaleString("default", {
        month: "long",
      });
      readableEndDate += ` ${date2.getDate()}, ${date2.getFullYear()}`;

      if (date1.getTime() <= todaysDate && todaysDate <= date2.getTime()) {
        return res
          .status(200)
          .json({ outage: true, start: readableStartDate, end: readableEndDate });
      } else if (date1.getTime() > todaysDate && todaysDate > date2.getTime()) {
        return res
          .status(200)
          .json({ outage: false, start: readableStartDate, end: readableEndDate });
      } else {
        return res.status(200).json({ outage: false, start: null, end: null });
      }

      // return res.status(200).json({ outage: maintenence[typeMessage] });
    } else {
      return res.status(500).json({ error: "no parameter given" });
    }
  }
});

// Protect everything under /protected
app.use(
  "/protected",
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, { session: false })
);

console.log(process.env.EMAIL_HOST);

app.get("/protected", (req, res) => {
  app.use(express.static(path.join(__dirname, "../build")));
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use(
  "/email",
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, { session: false })
);

app.post("/email", upload.single("fileUpload"), (req, res) => {
  const emailMessage = req.body;
  const emailFile = req.file;
  console.log(emailMessage, emailFile);

  console.log("Auth", req.user.email);

  const sendMail = (fileStream) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let text = `The developer is having an issue with ${
      emailMessage.title ||
      "a question outside of what the UPS Developer Assistant is able to handle"
    } specific to ${
      emailMessage.subtitle !== "Something Else"
        ? emailMessage.subtitle
          ? emailMessage.subtitle
          : "an unknown tool"
        : "an unknown tool"
    }.${
      emailMessage.subtitle === "Accessing a UPS Developed artifact"
        ? "  They are requesting access to a UPS Developed artifact."
        : emailMessage.subtitle
        ? "  They read through the wiki's steps and are still unable to fix their problem."
        : "  They did not read through the wiki's steps as they are asking a question that it doesn't have the answer to currently."
    }  Here is the developer's issue:

    ${emailMessage.issue}
    
    `;

    if (fileStream) {
      text += `The developer has also attached the code they are having an issue with to this email.

      `;
    }

    // text += `Can you please help?`;

    const options = {
      from: req.user.email,
      to: "brian.carroll25@ethereal.email",
      subject: `${emailMessage.title || "Unknown Error"}-${
        emailMessage.subtitle || "Unknown Question"
      }`,
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
