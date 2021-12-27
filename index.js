/* 
Project Name: getSpace (Home hosting and rental web application)
Project Authors: [Asfia Khan Rahmathi][Bushra Azmat Hussain][Joy Chandra Mollik]
Project Start Date: 28/11/2021
Project Type: A web application where user can host and rent available spaces
 */

// dependencies
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
// const admin = require('firebase-admin');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 5000;

// feature-request-board-firebase-adminsdk
// const serviceAccount = require('./feature-request-board-firebase-adminsdk.json');

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// });

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// mongodb initialization
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6vvik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// middleware for token verification
// async function verifyToken(req, res, next) {
// 	if (req?.headers?.authorization?.startsWith('Bearer ')) {
// 		const token = req.headers.authorization.split(' ')[1];

// 		try {
// 			const decodedUser = await admin.auth().verifyIdToken(token);
// 			req.decodedEmail = decodedUser.email;
// 		} catch {}
// 	}

// 	next();
// }

async function run() {
	try {
		client.connect();

		// initializing database & collections
		const database = client.db('featureRequestBoard');
		const userCollection = database.collection('users');
	} finally {
		await client.close();
	}
}

run().catch(console.dir);

// testing
app.get('/', (req, res) => {
	res.send('Server is running fine');
});

app.listen(port, () => {
	console.log('[RUNNING] server on port: ', port);
});
