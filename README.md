# Interactive comments section backend

It's an apllication that serves as a backend to the folowing [frontend aplication](https://github.com/mlatka9/Interactive-comments-section)

It serves Rest api which allows you to display, add, modify and delete comments. The api uses mongodb database. 
It also supports creating user accounts. Only logged in user can create new comments.

## How to run an application locally

First, clone the repository using `git clone` command Then you need to go to the root directory. In terminal type `npm install` to get dependencies. 
To run the application it is necessary to provide appropriate environment variables. In the root directory create an `.env` file where you put 
variables:

`MONGODB_URI` - link to mongodb database

`JWT_SECRET` - key used for user verification during login 

`PORT` - port on which the application will run (default 5000)

The application also includes tests created using the **supertest** library.
Set in the `.env` file the link to the mongodb database that will be used in the test environment by providing environment variable `TEST_MONGODB_URI`

In order to run the tests, in the terminal, type the command `npm test`

## The following tools were used to build the application:
- Node.js
- Express.js
- jsonwebtoken
- jest
- supertest
- mongodb
- mongoose
- bcryptjs
