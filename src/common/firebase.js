const admin = require('firebase-admin')
const config = require("../config/config");

// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccountKey),
    storageBucket: config.firebaseProjectId
})

// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
    bucket
}