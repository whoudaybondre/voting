const mongoose = require('mongoose');
require('dotenv').config();

//Define the mongodb connection url

const mongoURL = process.env.MOMGODB_LOCAL_URL;
// const mongoURL = process.env.MONGOBD_URL;

//setting up connection

mongoose.connect(mongoURL, {


})

//get the default connection
//mongoose maintain a deafault connecton object representing theongodb conncetion

const db = mongoose.connection;

db.on('connected', () => { console.log("connected to mongodb"); });
db.on('disconnected', () => { console.log("disconnected to mongodb"); });
db.on('error', (err) => { console.error('mongobd connection error', err); });

module.exports = db;