const express = require('express')
const app = express()
require('dotenv').config();
const db = require('./db');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;




//import router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

//use the router
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => { console.log("server is listening on port 3000"); })