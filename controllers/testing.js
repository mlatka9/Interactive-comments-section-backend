const User = require('../models/User')
const Comment = require('../models/Comment')

const clearAll = async (req, res) =>{
    await User.deleteMany({});
    await Comment.deleteMany({});

    res.status(204).end();
}


module.exports = {clearAll};

