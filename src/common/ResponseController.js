const { STATUS } = require('./constants');

class ResponseController {
    sendNoContentResponse(response, resObj = {}) {
        resObj['statusCode'] = STATUS.NO_CONTENT.CODE;
        resObj['statusMessage'] = STATUS.NO_CONTENT.TEXT;
        response.status(200).json({ data: resObj });
    }

    sendInternalErrorResponse(response, resObj = {}) {
        resObj['statusCode'] = STATUS.INTERNAL_ERROR.CODE;
        resObj['statusMessage'] = STATUS.INTERNAL_ERROR.TEXT;
        response.status(200).json({ data: resObj });
    }

    sendSuccessResponse(response, resObj = {}) {
        const resultObj = {};
        resultObj['statusCode'] = STATUS.SUCCESS.CODE;
        resultObj['statusMessage'] = STATUS.SUCCESS.TEXT;
        resultObj['data'] = resObj;
        response.status(200).json(resultObj);
    }

    sendNotAuthorizedResponse(response) {
        const resObj = {
            'statusCode': STATUS.NOT_AUTHORIZED.CODE,
            'statusMessage': STATUS.NOT_AUTHORIZED.TEXT
        };
        response.status(200).json({ data: resObj });
    }

    sendCreatedesponse(response, resObj = {}) {
        resObj['statusCode'] = STATUS.CREATED.CODE;
        resObj['statusMessage'] = STATUS.CREATED.TEXT;
        response.status(200).json({ data: resObj });
    }
}

module.exports = new ResponseController();