
import admin from "firebase-admin";

var serviceAccount = require("../get-a-pet-85cb9-firebase-adminsdk-ngs71-f5955a7f3a.json");

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default firebaseAdmin;

