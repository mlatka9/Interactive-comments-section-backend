require('dotenv').config()

const express = require('express');
require('express-async-errors');

const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

const commentsRoutes = require('./routes/comments')
const authRoute = require('./routes/auth')


const authMiddleware = require('./middleware/authentication')
app.use('/api/v1/comments', commentsRoutes.publicRouter)
app.use('/api/v1/comments', authMiddleware, commentsRoutes.protectedRouter)

app.use('/api/v1/auth', authRoute)

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT;
const connectDB = require('./db/connect')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        })
    } catch (error) {
        console.log(error)
    }
}

start();
