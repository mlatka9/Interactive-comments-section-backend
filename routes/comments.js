const express = require('express')

const publicRouter = express.Router();
const protectedRouter = express.Router();

const {createComment, getAllComments, updateComment, deleteComment} = require('../controllers/comments')

publicRouter.route('/').get(getAllComments)

protectedRouter.route('/').post(createComment)
protectedRouter.route('/:id').patch(updateComment).delete(deleteComment)


module.exports = {publicRouter, protectedRouter};