const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

const api = require('./index');

const initialComments = [
	{
		content: 'Example comment 1',
		score: 10,
		parent: null,
		user: '1',
	},
	{
		content: 'Example comment 2',
		score: 20,
		parent: null,
		user: '1',
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


describe('Comments API' , ()=>{

	test('GET / returns 2 comments', async ()=>{
		const response = await api
			.get('/api/v1/comments')
			.expect('Content-Type', /json/);
		expect(response.body).toHaveLength(2);
	});

	test('create new comment after successfull login', async () => {
		const credentials = {
			username: 'admin',
			password: 'password123'
		};
		const response = await api.post('/api/v1/auth/login')
			.send(credentials)
			.expect(200);

		const comment = {
			content: 'Example new comment',
			user: response.body.user.id,
			parent: null,
			score: 10,
		};

		const token = response.body.token;

		await api
			.post('/api/v1/comments')
			.set('Authorization', `Bearer ${token}`)
			.send(comment)
			.expect(201);

	});

	test('cannot create comment without token',async ()=> {
		const comment = {
			content: 'Example new comment',
			user: '1',
			parent: null,
			score: 10,
		};
		await api
			.post('/api/v1/comments')
			.send(comment)
			.expect(401);
	});

	test('comment can be removed only by person who created it', async ()=>{
		const credentials = {
			username: 'admin',
			password: 'password123'
		};
		const responseWithUser = await api.post('/api/v1/auth/login')
			.send(credentials)
			.expect(200);

		const comment = {
			content: 'Example comment to remove',
			user: responseWithUser.body.user.id,
			parent: null,
			score: 10,
		};

		const token = responseWithUser.body.token;

		const responseWithComment = await api
			.post('/api/v1/comments')
			.set('Authorization', `Bearer ${token}`)
			.send(comment)
			.expect(201);

		await api
			.delete(`/api/v1/comments/${responseWithComment.body.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);
	});

	test('comment cannot be removed by person who didn\'t created it', async ()=>{
		const fistComment = await Comment.findOne({});
		await api
			.delete(`/api/v1/comments/${fistComment.id}`)
			.expect(401);
	});


	test('comment can be liked by any user who provied token', async ()=> {
		const fistComment = await Comment.findOne({});
		const newUser = { 
			username: 'tom', 
			password: 'tompassword'
		};
		await User.create(newUser);

		const loginResponse = await api.post('/api/v1/auth/login')
			.send(newUser)
			.expect(200);

		api
			.patch(`/api/v1/comments/${fistComment.id}`)
			.set('Authorization', `Bearer ${loginResponse.token}`)
			.send({score: 100})
			.expect(200);
	});

	test('comment content can be modified by user who created it', async ()=> {
		const credentials = {
			username: 'admin',
			password: 'password123'
		};
		const responseWithUser = await api.post('/api/v1/auth/login')
			.send(credentials)
			.expect(200);

		const token = responseWithUser.body.token;
		const commentToModify = await Comment.findOne({user: responseWithUser.body.user.id});
		await api
			.delete(`/api/v1/comments/${commentToModify._id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);
	});

	test('comment content cannot be modified by user who didn\'t created it', async ()=> {
		const newUser = { 
			username: 'tom', 
			password: 'tompassword'
		};
		await User.create(newUser);

		const responseWithUser = await api.post('/api/v1/auth/login')
			.send(newUser)
			.expect(200);

		const token = responseWithUser.body.token;

		const commentToModify = await Comment.findOne({});
		await api
			.delete(`/api/v1/comments/${commentToModify._id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(401);
	});
});