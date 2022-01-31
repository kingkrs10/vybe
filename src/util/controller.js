const twilio = require("twilio");
const nodemailer = require("nodemailer");
const {Storage} = require('@google-cloud/storage');
const isImage = require('is-image');
const fs = require('fs');
var {join, dirname} = require('path');
const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');
const { tmpdir } = require("os");
const fse = require('fs-extra');
const sharp = require("sharp");

const {sendErrorResponse, sendInternalErrorResponse, sendSuccessResponse } = require("../common/ResponseController");
const { firebaseAdmin, bucket } = require("../common/firebase");
const pgHelper = require("../common/pgHelper");

const {
   twilioTest,
   firbaseDatabaseFileName,
   users_collection_name,
   offers_collection_name,
   currency_collection_name,
   transaction_history_collection_name,
   firebaseProjectId,
   firbaseCredentialsFileName
} = require("../config/config");
const accountSid = twilioTest.accountSid;
const authToken = twilioTest.authToken;


const client = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   service: "gmail",
   secure: false,
   //smtp.gmail.com  //in place of service use host...
   auth: {
      user: "luhubusiness@gmail.com",
      pass: "Spyd3r3x20khybr!dEx1",
      // pass: 'hclegcszmdjqmqln'
   },
});

const notification_options = {
   priority: "high",
   timeToLive: 60 * 60 * 24,
};

const bucketName = firebaseProjectId;
const credentialsFilePath = join(__dirname,`../../public/backup/${firbaseCredentialsFileName}`);
// const bucketName = "luhu-production.appspot.com";
// const credentialsFilePath = join(__dirname,`../../public/backup/serviceAccountKey-production.json`);
const storage = new Storage({
   keyFilename: credentialsFilePath,
   projectId: bucketName
});
var myBucket = storage.bucket(bucketName);

// const workingTumpDir = join(tmpdir(), 'thump');
const workingDir = join(tmpdir(), 'downloadImg');
const workingTumpDir = join(tmpdir(), 'thump');
var downloadFilepath = join(workingDir, 'source.png');
fse.ensureDir(workingDir);
fse.ensureDir(workingTumpDir);

const pushFirebaseNotification = async (request, response) => {
   try {
      const { deviceId, name } = request.body;
      var registrationToken = deviceId;
      var message = {
         data: { messageFrom: `${name}`, report: "true" },
         notification: {
            title: `${name}`,
            body: `${name} ❤ favorited your post.`,
            sound: "default",
         },
      };

      firebaseAdmin
         .messaging()
         .sendToDevice(registrationToken, message, notification_options)
         .then(result => {
            console.log('result', result);
            sendSuccessResponse(response, {message: "Notification sent successfully"})
         })
         .catch(error => {
            console.log(error);
            sendErrorResponse(response, error.toString());
         });

   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() });
   }
};

const sendSMS = async (request, response) => {
   try {
      var client = new twilio(accountSid, authToken);
      const { body, to } = request.body;
      client.messages
         .create({
            body: body,
            to: to,
            from: "+12314409907", // https://www.twilio.com/console should we get the free trail number ? click the "Twilio free trail number" button ..
         })
         .then((message) => {
            sendSuccessResponse(response, message);
         })
         .catch((error) => {
            sendErrorResponse(response, error.toString());
         });
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const sendMail = async (request, response) => {
   try {
      const { reportMessage, reportFrom, reportTo, deviceId } = request.body;
      // const destAdd = "luhubusiness@gmail.com";
      const destAdd = "kannan.d@mitrahsoft.com";

      const mailOptionsInfo = {
         from: "luhubusiness@gmail.com",
         to: destAdd,
         subject: "Luhu report",
         html: `<b>Hi,</b><br><br><p><b>${reportFrom.fullname}</b> reported as "${reportMessage}" to <b>${reportTo.fullname}</b></p>`,
      };

      var messageNotification = {
         data: {
            Id: `${reportTo}`,
            messageFrom: `${reportFrom.fullname}`,
            report: "true",
         },
         notification: {
            title: `${reportFrom.fullname}`,
            body: `${reportFrom.fullname} report to your post`,
            sound: "default",
         },
      };

      var deviceToken = deviceId;
      firebaseAdmin
         .messaging()
         .sendToDevice(
            deviceToken,
            messageNotification,
            notification_options
         )
         .then((response) => {
            // Response is a message ID string.
            console.log("Message send Successfully:", response);
            return true; //<- return a value
         })
         .catch((error) => {
            console.log("Message sending error:", response);
         });

      client.sendMail(mailOptionsInfo, (err, info) => {
         if (err) {
            console.log("errr", err);
            sendErrorResponse(response, err.toString());
         }
         console.log("info", info);
         sendSuccessResponse(response, {message:  `Mensagem enviada com sucesso. Id: ${info.messageId} | Response: ${info.response}`});
      });
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const migration = async (request, response) => {
   let qryClient = null;
   try {
      qryClient = await pgHelper.getClientFromPool();
   } catch (err) {
      throw err;
   }

   try {
      const filePath = join(__dirname,`../../public/backup/${firbaseDatabaseFileName}`);

      fs.readFile(filePath, "utf8", async(err, rawdata) => {
         if (err) {
            console.log("Error reading file from disk:", err);
            return;
         }
         try {
            const jsonData = JSON.parse(rawdata)["__collections__"];
            const userData = jsonData[users_collection_name] || [];
            const OfferData = jsonData[offers_collection_name]|| [];
            const currencyData = jsonData[currency_collection_name] || [];
            const transactionHistoryData = jsonData[transaction_history_collection_name] || [];
            const blockedUsersId = [];
            const inviteNumbersArr = [];
            const tempUserData = Object.keys(userData);
            const tempOfferData = Object.keys(OfferData);
            const temptransactionHistoryData = Object.keys(transactionHistoryData);

            console.log('Start the users data save process',tempUserData.length);
            // Currency Data Save pr
            console.log('start Currency migration process');
            delete currencyData.currencyDetails["__collections__"];
            await qryClient.query(`DELETE FROM "currency"`);
            await qryClient.query(`INSERT INTO "currency"(id, "currencyDetails") VALUES($1, $2)`, [uuidv4(), [currencyData.currencyDetails]]);
            console.log('Done Currency saved sucessfully');

            await Promise.all(tempUserData.map( async(item, index) => {
               try {
                  const value = userData[item];
                  const checkAvailable = await qryClient.query(`SELECT "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [item]);
                  if(_isEmpty(checkAvailable.rows[0])) {
                     const userId = uuidv4();
                     if(value.blockListID && !_isEmpty(value.blockListID)){
                        blockedUsersId.push({firebaseUId: item, userId: userId, blockListID: value.blockListID});
                     }
                     if(value.inviteNumber && !_isEmpty(value.inviteNumber)){
                        inviteNumbersArr.push({firebaseUId: item, userId: userId, inviteNumber: value.inviteNumber});
                     }
                     const milliseconds = value["registrationDate"]? value["registrationDate"]["value"]["_seconds"] * 1000  : '';
                     const date = milliseconds ? new Date(milliseconds) : new Date;
                     const reqObj = {
                        balance : value["balance"] || 0,
                        notificationUnReadcount: value['count'] || 0,
                        deviceId: value['deviceId'] || null,
                        fullName: value['fullname'],
                        imageURl: value['imageURl'] || null,
                        thump_imageURL: value['userTempImage'] || value['imageURl'] || null,
                        medium_imageURL: value['userTempImage'] || value['imageURl'] || null,
                        stripeCustomerId: value["stripeCustomerId"] || '',
                        latitude: value["currentLocation"] ? value["currentLocation"]["latitude"] : '',
                        longitude: value["currentLocation"] ? value["currentLocation"]["longitude"] : '',
                        currencyCode:  value["currencyDetails"] ? value["currencyDetails"]["code"] : '',
                        currencySymbol:  value["currencyDetails"] ? value["currencyDetails"]["symbol"] : '',
                        profession: value['profession'] || null,
                        createdAt: date,
                        phoneNumber: value['phoneNumber'] || null,
                        firebaseUId : value["uid"] ? value["uid"] : item
                     }
                     await qryClient.query(`INSERT INTO users(
                        "userId", balance, "notificationUnReadcount", "deviceId",
                        "fullName",	"userImage", "phoneNumber", "stripeCustomerId",
                        "currencyCode", "currencySymbol", profession, "createdAt", "firebaseUId", "userThumpImage", "userMediumImage")
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING "userId"`,
                     [userId, reqObj.balance, reqObj.notificationUnReadcount, `{${reqObj.deviceId}}`,
                     reqObj.fullName,`${reqObj.imageURl}`, reqObj.phoneNumber, reqObj.stripeCustomerId,
                     reqObj.currencyCode, reqObj.currencySymbol, reqObj.profession, reqObj.created_at, reqObj.firebaseUId, `${reqObj.thump_imageURL}`, `${reqObj.medium_imageURL}`]);

                     if(value.countryCurrency && !_isEmpty(value.countryCurrency)){
                        await value.countryCurrency.map(async items => {
                           await qryClient.query(`INSERT INTO "users_countryCurrency"("userId", amount, "oppPersonBalance", currency, label, value, "balanceData")
                           VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING "userId"`,
                           [userId, items.amount, items.oppPersonBalance, items.currency, items.label, items.value, items.balanceData]);
                        });
                     }
                  }
               } catch (error) {
                  console.log('error', error);
               }
            }));
            console.log('done User Data && start blocked Users');
            if(!_isEmpty(blockedUsersId)){
               await Promise.all(blockedUsersId.map(async item => {
                  item.blockListID.map(async bUid => {
                     const userData = await qryClient.query(`SELECT "userId", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [bUid] );
                     const blockedUserId = userData.rows[0]?.userId || null;
                     if(blockedUserId){
                        await qryClient.query(`INSERT INTO "users_blockedUsers" ("userId", "blockedUserId") VALUES ($1, $2)`, [item.userId, blockedUserId]);
                     }
                  })
               }));
            }

            if(!_isEmpty(inviteNumbersArr)){
                await Promise.all(inviteNumbersArr.map(async item => {
                  item.inviteNumber.map(async phoneNo => {
                     // const userData = await qryClient.query(`SELECT "uid", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [phoneNo] );
                     // const invitedUserId = userData.rows[0].uid;
                     // if(invitedUserId){
                     await qryClient.query(`INSERT INTO users_invites("senderUserId", "receiverPhoneNumber", status)
                     VALUES($1, $2, $3)`, [item.userId, phoneNo, 0]);
                     // }
                  })
               }));
            }

            console.log('Completed the users data save process');
            console.log('users_blockedUsers: total Records', blockedUsersId.length);
            console.log('Start Offer data save process', tempOfferData.length);

            const notDoneOffers = [];
            const offerFavoriteList = [];
            const reportListIDsArr = [];
            await Promise.all(tempOfferData.map( async(item, index) =>{
               try {
                  const value = OfferData[item];
                  // console.log('value',value);
                  const checkAvailable = await qryClient.query(`SELECT "firebaseOfferId" FROM offers WHERE "firebaseOfferId" = $1`, [item] );
                  const userData = await qryClient.query(`SELECT "userId", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [value['uid']] );
                  if(_isEmpty(checkAvailable.rows[0])) {
                     if(!_isEmpty(userData.rows[0])){
                        const userId = userData.rows[0].userId;
                        const offerId = uuidv4();
                        if(value.tempFavoriteID && !_isEmpty(value.tempFavoriteID)){
                           offerFavoriteList.push({firebaseOfferId: item, offerId: offerId, tempFavoriteIDs: value.tempFavoriteID});
                        }
                        if(value.reportListID && !_isEmpty(value.reportListID)){
                           reportListIDsArr.push({firebaseOfferId: item, offerId: offerId, reportListID: value.reportListID});
                        }
                        const transactionTime = value["createdAt"]? value["createdAt"]["value"]["_seconds"] * 1000  : '';
                        const createdAt = transactionTime ? new Date(transactionTime) : new Date();
                        const reqObj = {
                           headLine : value["headline"] || null,
                           imageURl: value['offerImage'] || null,
                           thump_imageURL: value['offerTempImage'] || null,
                           medium_imageURL: value['offerTempImage'] || null,
                           latitude: value["latitude"] || null,
                           longitude: value["longitude"] || null,
                           offerDescription: value['offerDescription'] || null,
                           locationName: value['locationName'],
                           firebaseOfferId: item
                        }
                        await qryClient.query(`INSERT INTO offers("offerId", "headLine", "offerImage", latitude, longitude, "offerDescription", "userId", "locationName", "firebaseOfferId", "createdAt", "offerThumpImage", "offerMediumImage")
                           VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                        [offerId, reqObj.headLine, `{${reqObj.imageURl}}`, reqObj.latitude, reqObj.longitude, reqObj.offerDescription, userId, reqObj.locationName, reqObj.firebaseOfferId, createdAt, `{${reqObj.thump_imageURL}}`, `{${reqObj.medium_imageURL}}`]);

                        if(value['offerHashTag'] && !_isEmpty(value['offerHashTag'])){
                           qryClient.query(`INSERT INTO "offers_hashTags"("offerId", "hashTag") VALUES ($1, $2)`, [offerId, value['offerHashTag']]);
                        }
                     } else {
                        notDoneOffers.push(item);
                     }
                  }
               } catch (error) {
                  console.log('error Offers', error, OfferData[item], item);
               }
            }));
            if(!_isEmpty(offerFavoriteList)){
               await Promise.all(offerFavoriteList.map(async item => {
                  item.tempFavoriteIDs.map(async favoriteID => {
                     const userData = await qryClient.query(`SELECT "userId", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [favoriteID] );
                     const favoriteUId = userData.rows[0]?.userId || null;
                     if(favoriteUId){
                        const favoriteData = await qryClient.query(`SELECT "userId", "offerId" FROM offers_favorites WHERE "offerId" = $1 AND "userId" = $2`, [item.offerId, favoriteUId] );
                        if(_isEmpty(favoriteData.rows[0])){
                           await qryClient.query(`INSERT INTO "offers_favorites" ("offerId", "userId") VALUES ($1, $2)`, [item.offerId, favoriteUId]);
                        }
                     }
                  })
               }))
            }

            if(!_isEmpty(reportListIDsArr)){
               await Promise.all(reportListIDsArr.map(async item => {
                  item.reportListID.map(async reporterId => {
                     const userData = await qryClient.query(`SELECT "userId", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [reporterId] );
                     const reporterUserId = userData.rows[0]?.userId || null;
                     if(reporterUserId){
                        await qryClient.query(`INSERT INTO offers_reports("offerId", "reporterUserId") VALUES ($1, $2)`, [item.offerId, reporterUserId]);
                     }
                  })
               }))
            }

            console.log('Completed the Offer data save process');
            console.log('offers_favorites: total Records', offerFavoriteList.length);
            console.log('offers_reports: total Records', reportListIDsArr.length);

            // Transaction History Data Save Prcess.
            console.log('Start Transaction data save process', temptransactionHistoryData.length);
            await Promise.all(temptransactionHistoryData.map( async(item, index) =>{
               try {
                  const value = transactionHistoryData[item];
                  // console.log('temptransactionHistoryData', value);
                  const senderUserData = await qryClient.query(`SELECT "userId", "currencyCode", "currencySymbol", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [value['sender_id']]);
                  const receiverUserData = await qryClient.query(`SELECT "userId", "firebaseUId" FROM users WHERE "firebaseUId" = $1`, [value['receiver_id']]);
                  const checkAvailable = await qryClient.query(`SELECT "firebaseTransactionId" FROM "transactionHistories" WHERE "firebaseTransactionId" = $1`, [item] );
                  const senderData = senderUserData.rows[0] || null;
                  const transactionTime = value["transaction_date"]? value["transaction_date"]["value"]["_seconds"] * 1000  : '';
                  const createdAt = transactionTime ? new Date(transactionTime) : new Date();
                  if(_isEmpty(checkAvailable.rows[0])) {
                     if(!_isEmpty(senderData) && !_isEmpty(receiverUserData.rows[0]) ){
                        const senderID = senderData?.userId ;
                        const receiverID = receiverUserData.rows[0]?.userId;
                        const transactionId = uuidv4();
                        const reqObj = {
                           amount: value['amount'] || null,
                           senderUId: senderID || null,
                           receiverUId: receiverID || null,
                           senderCurrencyCode: value['senderSymbol'] ? value['senderCurrency'] : senderData.currencyCode ? senderData.currencyCode : null,
                           senderSymbol: value['senderSymbol'] ? value['senderSymbol'] : senderData["currencySymbol"] ? senderData["currencySymbol"] : null,
                           firebaseTransactionId: item
                        }
                        await qryClient.query(`INSERT INTO "transactionHistories" ("transactionId", amount, "senderUserId", "receiverUserId", "senderCurrencyCode", "senderSymbol", "firebaseTransactionId", "createdAt")
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [transactionId, reqObj.amount, reqObj.senderUId, reqObj.receiverUId, reqObj.senderCurrencyCode, reqObj.senderSymbol, reqObj.firebaseTransactionId, createdAt]);
                     }
                  } else {
                     console.log('traction Fail ', item);
                  }

               } catch (error) {
                 console.log('error Offers', error, index);
               }
            }));
            console.log('done Transaction History Data collection Details');
            sendSuccessResponse(response, {});
         } catch (err) {
           sendInternalErrorResponse(response, { message: err.toString() });
         }
      });
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const fetchImages = async (collectionName) => {
   console.log('fetchCall');
   const [files] = await myBucket.getFiles();
   const Images = [];
   const ResizedImages = []

   await files.map(item => {
      if(!item.name.includes('_200x200') && !item.name.includes('_400x400') && !item.name.includes('_1080x1080')){
         Images.push(item.name);
      } else {
         ResizedImages.push(item.name);
      }
   });

   const checkAvailable = (filename) => {
      const res = ResizedImages.filter(i => i.includes(filename));
      return res.length ? true : false;
   }

   console.log('get file1', files.length, Images.length, ResizedImages.length);
   const collectionImages = []
   await Promise.all(
      Images.map(item => {
         const tempFilename = item.split('.');
         if(item.includes(collectionName) && !checkAvailable(`${tempFilename[0]}`)){
            collectionImages.push(item);
         }
      })
   )
   return collectionImages;
}


const firebaseImageDownload = async (request, response) => {
   console.log('firebaseImageDownload');
   try {
      const downloadSuccess = [];
      const downloadFail = [];
      // const imagesData = await fetchImages(request.params.id);
      const imagesData = [];
      console.log('imagesData', imagesData.length);
      await Promise.all(imagesData.map(async (file, index) => {
         const fileNameArr = file.split('/');
         const fileName = fileNameArr.pop();
         // DownLoad Source File
         downloadFilepath = join(workingDir, `${fileNameArr[1]}_temp_${fileName}`);
         try {
            await myBucket.file(file).download({
               destination: downloadFilepath
            });
            downloadSuccess.push(file);
         } catch (error) {
            downloadFail.push(file);
            console.log('download error', error);
         }
      }));
      console.log('Complete Download Process', imagesData.length, downloadSuccess.length, downloadFail.length);
      const res = { message: 'Complete Download Process', data: {success: downloadSuccess, fail: downloadFail}};
      sendSuccessResponse(response, res);
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const firebaseImageResize = async (request, response) => {
   try {
      const imagesData = await fetchImages(request.params.id);
      const resizeSucc = [];
      const resizeFail = [];
      // const imagesData = [];
      await Promise.all(imagesData.map(async (file, index) => {
         const fileNameArr = file.split('/');
         const fileName = fileNameArr.pop();
         await Promise.all([200, 400, 1080].map(async size => {
            const tempFilename = fileName.split('.');
            const imageResizename = `${fileNameArr[1]}_temp_${tempFilename[0]}_${size}x${size}.${tempFilename[1]}`;
            const resizepath = join(workingTumpDir, imageResizename);
            sourceFilepath = join(workingDir, `${fileNameArr[1]}_temp_${fileName}`);
            try {
               if(isImage(sourceFilepath)){
                  await sharp(sourceFilepath, { failOnError: false })
                  .rotate()
                  .resize(size, size,{fit: 'inside'})
                  .toFile(resizepath);
                  resizeSucc.push(`${fileNameArr[1]}_temp_${fileName}`);
               } else {
                  console.log('resize issue', downloadFilepath);
               }
            } catch (error) {
               console.log('error:resize', `${fileNameArr[1]}_temp_${fileName}`, '::', error);
               resizeFail.push(`${fileNameArr[1]}_temp_${fileName}`);
            }
         }));
      }));
      console.log('Complete resize Process', imagesData.length, resizeSucc.length, resizeFail.length);
      const res = { message: 'done image resize process', data: {success: resizeSucc, failure: resizeFail }};
      sendSuccessResponse(response, res);
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const firebaseImageUpload = async (request, response) => {
   try{
      // const imageData = await fetchImages(request.params.id);
      const imageData = [];
      console.log('imageData', imageData.length);
      const uuid = uuidv4();
      const uploadSuccess = [];
      const uploadFail = [];
      await Promise.all(imageData.map(async (file, index) => {
         const fileNameArr = file.split('/');
         const fileName = fileNameArr.pop();
         await Promise.all([200, 400, 1080].map(async size => {
            const tempFilename = fileName.split('.');
            const sourceFileName = `${fileNameArr[1]}_temp_${tempFilename[0]}_${size}x${size}.${tempFilename[1]}`;
            const uploadImageName = `${tempFilename[0]}_${size}x${size}.${tempFilename[1]}`;
            const resizepath = join(workingTumpDir, sourceFileName);
            const uploadFilepath = `photos/${fileNameArr[1]}/${fileNameArr[2]}/${uploadImageName}`
            const mimeType = tempFilename[1] === 'png' ? 'image/png' : 'image/jpeg'
            try {
               if(isImage(resizepath)){
                  await myBucket.upload(resizepath, {
                     gzip: true,
                     destination: uploadFilepath,
                     metadata: {
                        contentType: mimeType,
                        metadata: {
                           firebaseStorageDownloadTokens: uuid
                        }
                     },

                  })
                  uploadSuccess.push(file);
               } else {
                  uploadFail.push(uploadImageName);
               }

            } catch (error) {
               uploadFail.push(file);
            }
         }));
      }));

      console.log('Done Upload process', imageData.length, uploadSuccess.length, uploadFail.length);
      const res = { message: 'Done Upload process', data: {uploadSuccess, uploadFail}};
      // return fse.remove(workingDir)
      sendSuccessResponse(response, res);
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const firebaseImageDelete = async (request, response) => {
   console.log('firebaseImageDelete');
   const success = [];
   const failure = [

   ];
   try {
      const imageData = []
      await Promise.all(imageData.map(async (file, index) => {
         const fileNameArr = file.split('/');
         const fileName = fileNameArr.pop();
         const tempFilename = fileName.split('.');
         await Promise.all([200, 400, 1080].map(async size => {
            const deleteFileName = `${tempFilename[0]}_${size}x${size}.${tempFilename[1]}`;
            const deletePath = `photos/${fileNameArr[1]}/${fileNameArr[2]}/${deleteFileName}`
            try {
               await myBucket.file(deletePath).delete();
               success.push(file)
            } catch (error) {
               failure.push(file);
            }
         }));
      }));
      const res = { message: 'Done delete process', data: {success: success, failure: failure }};
      sendSuccessResponse(response, res);
   } catch (error) {
       sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const offerMigration = async(request, response) => {
   try{
      let qryClient = null;
      try {
         qryClient = await pgHelper.getClientFromPool();
      } catch (err) {
         throw err;
      }
      const offerData = await qryClient.query(`SELECT * FROM "offers" O
         INNER JOIN "offers_hashTags" OH ON O."offerId" = OH."offerId" AND "hashTag" like $1
      `,['Product%'])
      if(offerData.rowCount>0){
         await Promise.all(offerData.rows.map(async(items,index) =>{
            const productId = uuidv4();
            await qryClient.query(`INSERT INTO "products"
               (
                  "productId",
                  "productName",
                  "productDescription",
                  "productImageURL",
                  "productThumpImageURL",
                  "productMediumImageURL"
               ) VALUES ($1, $2, $3, $4, $5, $6)`,
               [
                  productId,
                  items.headLine,
                  items.offerDescription,
                  items.imageURl,
                  items.thumpImageURL,
                  items.mediumImageURL
            ])
         })
         )
      }
      sendSuccessResponse(response, {});
   } catch (error){
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

module.exports = {
   pushFirebaseNotification,
   sendSMS,
   sendMail,
   migration,
   firebaseImageResize,
   firebaseImageDownload,
   firebaseImageUpload,
   firebaseImageDelete,
   offerMigration
};
