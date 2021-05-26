require('dotenv').config()
const dotenv = require("dotenv");

dotenv.config();

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
require('dotenv').config();

var mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const mongoCon = process.env.mongoCon;
// mongodb+srv://dbadmin:admin123456@cluster0.eznhs.mongodb.net/test
// mongoose.connect('mongodb://localhost:27017/myfirstmongodb', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb+srv://dbadmin:admin123456@cluster0.eznhs.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(mongoCon, { useNewUrlParser: true, useUnifiedTopology: true });

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

const UsersRoutes = require('./app/routes/user.router');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", UsersRoutes);

app.get('*', (req, res) => {
    res.send('Page Doesnot exists');
});
app.listen(process.env.PORT || 5000, () => {
    console.log('Express application running on localhost:3000');
});