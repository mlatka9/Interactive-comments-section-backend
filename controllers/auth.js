const User = require('../models/User');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const {BadRequestError, UnauthenticatedError} = require('../errors/index');

const register = async (req, res) => {
	const {username, password} = req.body;

	const userObject = {
		username, 
		password,
		image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*60 + 1)}`
	};
	const user = await User.create(userObject);

	res.status(201).json(user);
};

const login = async (req, res) => {
	const {username, password} = req.body;

	if(!username) {
		throw new BadRequestError('Login is required', ['login']);
	}
	if(!password) {
		throw new BadRequestError('Password is required', ['password']);
	}

	const user = await User.findOne({username});
    
	if(!user) {
		throw new UnauthenticatedError('Provided credentials are not valid');
	}
	const isPasswordCorrect = await bcrypt.compare(password, user.password);
	if(isPasswordCorrect) {
		const token = jwt.sign({id: user._id, username}, process.env.JWT_SECRET);
		return res.json({user, token});
	}

	throw new UnauthenticatedError('Provided credentials are not valid');
};

module.exports = {register, login};