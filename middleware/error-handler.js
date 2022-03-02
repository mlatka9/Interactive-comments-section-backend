const CustomAPIError = require("../errors/custom-api")
const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

    if(err instanceof CustomAPIError) {
        console.log("ERR", err)
        return res.status(err.statusCode).json({error: err.message})
    }
    console.log(err);


    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Something went wrong try again later'})
}

module.exports = errorHandlerMiddleware;