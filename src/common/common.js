
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

// Decode Login User JWT token
const decodeJwtToken = async (token) => {
    const jwtDecode = jwt.verify(token, config.app.secretKey);
    return jwtDecode;
}

const createJwtToken = async(userData) => {
    const payload = {
        userId: userData.userid,
        firebaseUId: userData.uid,
        phoneNumber: userData.phoneNumber,
        latitude: userData.latitude,
        longitude: userData.longitude,
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
    decodeJwtToken,
    createJwtToken,
    authMiddleware
};
