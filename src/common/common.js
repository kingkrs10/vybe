const multer = require('multer')
const pgHelper = require("./pgHelper");
const { v4: uuidv4 } = require('uuid');
const firebase = require('./firebase')
const config = require("../config/config");
const fs = require('fs');

const tryBlock = async (data, modelName, model) => {
    let client = null;
    try {
        client = await pgHelper.getClientFromPool();
    } catch (err) {
        throw err;
    }
    try {
        let result = {};
        result = await model(data, client);
        client.release();
        return result;
    } catch (error) {
        console.log(`error:${modelName})`, new Date(), error);
        client.release();
        throw error;
    }
};

const fileUpload = async (data, uid, foldername) => {
    const uuid = uuidv4();
    const filePath = `photos/${uid}/${foldername}/${data.originalname}`;
    const result = await firebase.bucket.upload(data.path, {
        gzip: true,
        destination: filePath,
        metadata: {
            contentType: data.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        },
    });
    if (result){
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${config.firebaseProjectId}/o/${encodeURIComponent(filePath)}?alt=media&token=${uuid}`;
        const resp = {
            fileName: data.originalname,
            fileLocation: publicUrl
        }
        fs.unlink(data.path, (err) => {
            if (err) {
                console.error(err)
                return resp;
            }
        });
        return resp
    } else {
        return {};
    }
};

const upload = multer({
    dest: './public/photos/',
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
})

module.exports = { tryBlock, upload, fileUpload };
