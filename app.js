require('dotenv').config()

const express = require('express');
require('express-async-errors');

const cors = require('cors')
const app = express();

const connectDB = require('./db/connect')

connectDB()
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });


app.use(cors())
app.use(express.json());

const commentsRoutes = require('./routes/comments')
const authRoute = require('./routes/auth')

const morgan = require('morgan')
app.use(morgan('tiny'))

const authMiddleware = require('./middleware/authentication')
app.use('/api/v1/comments', commentsRoutes.publicRouter)
app.use('/api/v1/comments', authMiddleware, commentsRoutes.protectedRouter)
app.use('/api/v1/auth', authRoute)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./routes/testing')
    app.use('/api/v1/testing', testingRouter)
}

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


module.exports = app;

