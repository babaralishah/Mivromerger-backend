const UsersRoutes = require('./app/routes/user.router');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/myfirstmongodb', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", UsersRoutes);

app.get('*', (req, res) => {
    res.send('Page Doesnot exists');
});
app.listen(3000, () => {
    console.log('Express application running on localhost:3000');
});