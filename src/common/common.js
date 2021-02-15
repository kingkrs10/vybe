const multer = require('multer')
const pgHelper = require("./pgHelper");
const { v4: uuidv4 } = require('uuid');
const firebase = require('./firebase')
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const _isUndefined = require('lodash/isUndefined');
const usersModel = require("../users/model");
const responseController = require("./ResponseController");

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

// Decode Login User JWT token
const decodeJwtToken = async (token) => {
    const jwtDecode = jwt.verify(token, config.app.secretKey);
    return jwtDecode;
}

const createJwtToken = async(userData) => {
    const payload = {
        userId: userData.uid,
        phoneNumber: userData.phoneNumber,
        logintime: Math.round(new Date().getTime() / 1000)
    };
    const token = jwt.sign(JSON.stringify(payload), config.app.secretKey);
    return token;
}

const authMiddleware = async (request, response, next) => {
    const token = request.headers.authorization;
    if (!_isUndefined(token)) {
        let authorization = token;
        if (token.includes('Bearer')){
            authorization = token.split(' ')[1];
        }
        try {
            jwt.verify(authorization, config.app.secretKey, async(err, decoded) => {
                if (err) {
                    responseController.sendNotAuthorizedResponse(response);
                }
                if (decoded) {
                    const checkUserExist = await tryBlock(
                        { id: decoded.userId },
                        "(User:check auth Middleware)",
                        usersModel.getOne
                    )
                    if (checkUserExist) {
                        request.currentUser = decoded;
                        next();
                        return;
                    }
                }
            })
        } catch (error) {
            responseController.sendNotAuthorizedResponse(response);
        }
    } else {
        responseController.sendNotAuthorizedResponse(response);
    }
};

module.exports = {
    tryBlock,
    upload,
    fileUpload,
    decodeJwtToken,
    createJwtToken,
    authMiddleware
};
