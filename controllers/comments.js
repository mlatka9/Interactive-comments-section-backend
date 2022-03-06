const { UnauthenticatedError } = require('../errors');
const Comment = require('../models/Comment')

const getAllComments = async (req, res) => {
    const comments = await Comment.find().populate('user');
    res.json(comments)
}

const createComment = async (req, res) => {
    const comment = new Comment(req.body);
    const createdComment = await comment.save();
    await Comment.populate(createdComment, { path: "user" });
    res.status(201).json(createdComment)
}

const updateComment = async (req, res) => {
    const { content, score } = req.body;
    const id = req.params.id;

    if(score)  {
        const updatedComment = await Comment.findByIdAndUpdate(id, {score}, { new: true, runValidators: true })
        await Comment.populate(updatedComment, { path: "user" });
        return res.json(updatedComment)
    }

    if(content) {
        const commentToUpdate = await Comment.findOne({_id: id, user: req.user.id})
        if(!commentToUpdate) {
            throw new UnauthenticatedError('You are unauthorized to modify this comment')
        }
        commentToUpdate.content = content;
        const updatedComment = await commentToUpdate.save();
        await Comment.populate(updatedComment, { path: "user" });
        return res.json(updatedComment)
        }
}

const deleteComment = async (req, res) => {
    const id = req.params.id;

    const isOwner =  await Comment.count({_id: id, user: req.user.id})
    if(!isOwner) throw new UnauthenticatedError('You are unauthorized to delete this comment')
    const replies = await Comment.findOne({ parent: id });

    if (replies) {
        const updatedComment = await Comment.findByIdAndUpdate(id, { content: 'removed' }, { new: true, runValidators: true })
        await Comment.populate(updatedComment, { path: "user" });
        return res.json(updatedComment)
    }

    await Comment.findByIdAndDelete(id);
    return res.status(204).end();
}

module.exports = {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}