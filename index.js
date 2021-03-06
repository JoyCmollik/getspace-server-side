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

async function run() {
	try {
		client.connect();

		// initializing database & collections
		const database = client.db('getSpace');
		const userCollection = database.collection('users');
		const placeCollection = database.collection('places');
		const reservationCollection = database.collection('reservations');

		///// USERS collection CRUD operation /////

		// storing user with registration process
		app.post('/user', async (req, res) => {
			const user = req.body;
			console.log(user);
			const result = await userCollection.insertOne(user);

			res.send(result);
		});

		// storing user signed in with google
		app.put('/user', async (req, res) => {
			const user = req.body;
			console.log(user);

			const filter = { email: user.email };
			const options = { upsert: true };
			const updateUser = { $set: user };
			const result = await userCollection.updateOne(
				filter,
				updateUser,
				options
			);

			res.json(result);
		});

		///// PLACE collection CRUD operation /////

		// an api to get all of the places
		app.get('/place', async (req, res) => {
			const cursor = placeCollection.find();

			const placeList = await cursor.toArray();

			res.send(placeList);
		});

		// an api to get only one place item
		app.get('/place/:_id', async (req, res) => {
			const _id = req.params._id;

			const filter = { _id: ObjectId(_id) };

			const place = await placeCollection.findOne(filter);

			res.send(place);
		});

		// an api to store single place item
		app.post('/place', async (req, res) => {
			const place = req.body;

			const result = await placeCollection.insertOne(place);

			res.send(result);
		});

		///// RESERVATION collection CRUD operation /////

		// an api to send all of the client reservations
		app.get('/reservation/:uid', async (req, res) => {
			const uid = req.params.uid;
			const query = { client_uid: uid };
			const cursor = reservationCollection.find(query);
			const foundReservations = await cursor.toArray();

			res.json(foundReservations);
		});

		// an api to store single reservation item
		app.post('/reservation', async (req, res) => {
			const reservation = req.body;

			const result = await reservationCollection.insertOne(reservation);

			res.send(result);
		});
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
