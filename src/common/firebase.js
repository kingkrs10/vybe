const admin = require('firebase-admin');
const { serviceAccountKey, firebaseProjectId } = require("../config/config");

// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    storageBucket: firebaseProjectId,
    databaseURL: "https://luhu-dev.firebaseio.com",
})

// Cloud storage
const bucket = admin.storage().bucket();
const firebaseAdmin = admin;
module.exports = {
    bucket,
    firebaseAdmin
}