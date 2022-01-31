const { STATUS } = require('./constants');

class ResponseController {
    sendSuccessResponse(response, resObj = {}) {
        const resultObj = {};
        resultObj['statusCode'] = STATUS.SUCCESS.CODE;
        resultObj['statusMessage'] = STATUS.SUCCESS.TEXT;
        resultObj['data'] = resObj;
        response.status(200).json(resultObj);
    }

    sendNoContentResponse(response, resObj = []) {
        const resultObj = {};
        resultObj['statusCode'] = STATUS.NO_CONTENT.CODE;
        resultObj['statusMessage'] = STATUS.NO_CONTENT.TEXT;
        resultObj['data'] = resObj;
        response.status(200).json(resultObj);
    }

    sendInternalErrorResponse(response, resObj = {}) {
        resObj['statusCode'] = STATUS.INTERNAL_ERROR.CODE;
        resObj['statusMessage'] = STATUS.INTERNAL_ERROR.TEXT;
        response.status(200).json(resObj);
    }

    sendNotAuthorizedResponse(response) {
        const resObj = {
            'statusCode': STATUS.NOT_AUTHORIZED.CODE,
            'statusMessage': STATUS.NOT_AUTHORIZED.TEXT
        };
        response.status(200).json(resObj);
    }

    sendCreatedResponse(response, resObj = {}) {
        resObj['statusCode'] = STATUS.CREATED.CODE;
        resObj['statusMessage'] = STATUS.CREATED.TEXT;
        response.status(200).json({ data: resObj });
    }
    sendErrorResponse(response, message) {
        const resObj = {};
        resObj['statusCode'] = STATUS.INTERNAL_ERROR.CODE;
        resObj['statusMessage'] = message;
        response.status(200).json(resObj);
    }
}

module.exports = new ResponseController();