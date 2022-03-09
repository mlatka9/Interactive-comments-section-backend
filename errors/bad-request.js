const CustomAPIError = require('./custom-api');
const {StatusCodes} = require('http-status-codes');

class BadRequestError extends CustomAPIError {
	constructor(message, fields = []) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
		this.fields = fields;
	}
}

module.exports = BadRequestError;