const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://skripsi-cf882.firebaseio.com",
});

const app = express();
app.use(cors({ origin: true }));

app.post("/createNewUser", function (req, res) {
  admin.auth()
    .createUser({
      email: req.body.email,
      password: req.body.password,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.send({uid: userRecord.uid});
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });

  
});

exports.api = functions.https.onRequest(app);

// app.listen(3000, function () {
//   console.log("Example app listening on port 3000!");
// });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
