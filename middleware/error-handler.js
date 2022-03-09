const CustomAPIError = require('../errors/custom-api');
const {StatusCodes} = require('http-status-codes');


const errorHandlerMiddleware = (err, req, res) => {

	if(err instanceof CustomAPIError) {
		return res.status(err.statusCode).json({message: err.message});
	}
	if(err.name === 'ValidationError' ) {
		return handleValidationError(err, res);
	}
	if(err.code && err.code == 11000) {
		return handleDuplicateKeyError(err, res);
	}
	console.log(err);
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Something went wrong try again later'});
};

const handleDuplicateKeyError = (err, res) => {
	const field = Object.keys(err.keyValue);
	const code = StatusCodes.CONFLICT;
	const error = `An account with that ${field} already exists.`;
	res.status(code).send({message: error, fields: field});
};

const handleValidationError = (err, res) => {
	let errors = Object.values(err.errors).map(el => el.message);
	let fields = Object.values(err.errors).map(el => el.path);
	const formattedErrors = errors.join(' ');
	if(errors.length > 1) {
		res.status(StatusCodes.BAD_REQUEST).send({message: formattedErrors, fields});
	} else {
		res.status(StatusCodes.BAD_REQUEST).send({message: formattedErrors, fields});
	}
};

module.exports = errorHandlerMiddleware;