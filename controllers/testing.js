const User = require('../models/User')
const Comment = require('../models/Comment')

const initialUser = { 
    username: 'admin', 
    image: 'https://i.pravatar.cc/150?img=5', 
    password: 'password123'
}

const initialComments = [
    {
        content: 'Example comment 11',
        score: 10,
        parent: null,
    },
    {
        content: 'Example comment 22',
        score: 20,
        parent: null,
    },
]

const clearAll = async (req, res) =>{
    await Comment.deleteMany();
    await User.deleteMany();
    const user = await User.create(initialUser)
    for(let comment of initialComments) {
        comment.user = user._id;
        await Comment.create(comment);
    }

    res.status(204).end();
}

module.exports = {clearAll};

