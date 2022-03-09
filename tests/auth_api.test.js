const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

const api = require('./index');

const initialComments = [
	{
		content: 'Example comment 1',
		score: 10,
		parent: null,
	},
	{
		content: 'Example comment 2',
		score: 20,
		parent: null,
	},
];


beforeEach(async ()=>{
	await User.deleteMany({});
	await Comment.deleteMany({});

	const initialUser = { 
		username: 'admin', 
		image: 'https://i.pravatar.cc/150?img=5', 
		password: 'password123'
	};

	const user = await User.create(initialUser);

	for(let comment of initialComments) {
		comment.user = user;
		await Comment.create(comment);
	}
});

afterAll(() => {
	mongoose.connection.close();
});

describe('Auth API' , ()=>{

	test('creating new User', async ()=> {
		const newUser = {
			username: 'jhon',
			password: 'smith'
		};
		const response = await api.post('/api/v1/auth/register')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /json/);

		expect(response.body).toHaveProperty('username');
		expect(response.body).toHaveProperty('image');
		expect(response.body).toHaveProperty('id');
	});

	test('login' , async ()=>{
		const credentials = {
			username: 'admin',
			password: 'password123'
		};
		await api.post('/api/v1/auth/login')
			.send(credentials)
			.expect(200);
	});

	test('return token in login response' , async ()=>{
		const credentials = {
			username: 'admin',
			password: 'password123'
		};
		const response = await api.post('/api/v1/auth/login')
			.send(credentials)
			.expect(200);
        
		expect(response.body.token).toBeTruthy();
	});
});