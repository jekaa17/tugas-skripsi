var express = require("express");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
var admin = require("firebase-admin");
const cors = require("cors");

var serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skripsi-cf882.firebaseio.com",
});

var app = express();
app.use(cors({ origin: true }));

app.get("/", function (req, res) {
  getAuth()
    .createUser({
      email: "user@example.com",
      emailVerified: false,
      phoneNumber: "+11234567890",
      password: "secretPassword",
      displayName: "John Doe",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });

  res.send("Hello World!");
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
