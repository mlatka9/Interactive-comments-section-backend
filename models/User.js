const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username must is required"],
        unique: [true, "Username must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password must is required"],
    },
    image: String,
})

CommentSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password
        return ret;
    }
};

module.exports = mongoose.model("User", CommentSchema)