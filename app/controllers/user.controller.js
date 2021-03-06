const usersController = {};
const Users = require('../models/user.model');
const User = require('../models/user.model');

const path = require('path');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

usersController.getAll = async (req, res) => {
    let users;
    try {
        let merged = {};
        const start = 0;
        const length = 100;
        users = await Users.paginate(
            merged,
            {
                offset: parseInt(start),
                limit: parseInt(length)
            }
        );
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: users
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};


usersController.getSingleUser = async (req, res) => {
    let user;
    try {
        const _id = req.params._id;
        user = await Users.findOne({ _id: _id });
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: user
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};
usersController.registerUser = async (req, res) => {

    try {
        const body = req.body;
        const password = body.password;

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        body.password = hash;

        // console.log(req.body.email);
        console.log('\n\n \n hash - > ', hash);
        const findUser = await User.findOne({ email: req.body.email });
        console.log("\n\n\nEmail exist in database:\n\n\n", findUser);
        const user = new Users(body);
        const result = await user.save();

        if (findUser) {
            console.log("Email exist in database:", findUser);
            res.status(409).json({
                success: false,
                status: "Email already in use, try with another email!",
            });
        }
        else {
            const token = jsonwebtoken.sign({
                data: body,
                role: 'User'
            }, 'supersecretToken', { expiresIn: '7d' });

            console.log('token -> ', token)
            res.send({ message: 'Signup successful', token: token });

            res.send({
                message: 'Signup successful'
            });
        }

    }
    catch (ex) {
        console.log('\n\n\nex', ex)

        if (ex.code === 11000) {
            res.send({
                message: 'Email already in use, try with another email!',
                detail: ex
            }).status(500);
        }
        else {
            res.send({
                message: 'Error here',
                detail: ex
            }).status(500);
        }
    }
};


usersController.updateUser = async (req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;
        let updates = req.body;
        runUpdate(_id, updates, res);
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

async function runUpdate(_id, updates, res) {
    try {
        const result = await Users.updateOne(
            {
                _id: _id
            },
            {
                $set: updates
            },
            {
                upsert: true,
                runValidators: true
            }
        );

        {
            console.log('\n\n\n result.nModified', result.nModified);
            if (result.nModified == 1) {
                res.status(200).send({
                    code: 200,
                    message: 'Updated Successfully'
                });
            } else if (result.upserted) {
                res.status(200).send({
                    code: 200,
                    message: 'Created Successfully'
                });
            } else {
                res.status(422).send({
                    code: 422,
                    message: 'Unprocessible Entity\n (This could also because you have not made any changes)'
                });
            }
        }

    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
}

usersController.loginUser = async (req, res) => {


    try {
        const body = req.body;
        const email = body.email;

        const result = await Users.findOne({ email: email });
        console.log('\n\n Result: \t', body);
        if (!result) {
            // this means result is null
            res.status(401).send({
                message: 'This user does not exists. Please signup first'
            });
        } else {
            if (bcrypt.compareSync(body.password, result.password)) {
                result.password = undefined;
                delete result['password'];
                const token = jsonwebtoken.sign({
                    data: body,
                    role: 'User'
                }, 'supersecretToken', { expiresIn: '7d' });

                console.log('token -> ', token)

                res.send({ message: 'Successfully Logged in', token: token });
            }
            else {
                console.log('password doesnot match');

                res.status(401).send({ message: 'Wrong Password Entere' });
            }
        }
    } catch (ex) {
        console.log('ex', ex);
    }
};

usersController.deleteUser = async (req, res) => {
    if (!req.params._id) {
        res.status(500).send({
            message: 'ID missing'
        });
    }
    try {
        const _id = req.params._id;

        const result = await Users.findOneAndDelete({
            _id: _id
        });
        res.status(200).send({
            code: 200,
            message: 'Deleted Successfully'
        });
    } catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
};

module.exports = usersController;