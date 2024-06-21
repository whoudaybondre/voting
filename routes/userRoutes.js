const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const { jwtAuthMidlleware, generateToken } = require('./../jwt');



router.post('/signup', async(req, res) => {
    try {
        const data = req.body; //assuming the request body contains the User data

        //create a new User document using mongoose
        const newUser = new User(data);


        //save to database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id

        }
        console.log(JSON.stringify(payload));

        const token = generateToken(payload);
        console.log('token saved :', token);

        res.status(200).json({ response: response, token: token });


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });

    }
})

//login route
router.post('/login', async(req, res) => {
    try {
        //extract the aadharCardNumber and password
        const { aadharCardNumber, password } = req.body;
        // console.log(aadharCardNumber);
        // console.log(password);

        //find user by aadharCardNumber
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        //if user not found and password is wrong
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'invalid aadharCardNumber and password' });
        }

        //gnerate token
        const payload = {
            id: user.id

        }

        const token = generateToken(payload);

        //return token as response
        res.json({ token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})



//update password
router.put('/profile/password', jwtAuthMidlleware, async(req, res) => {
    try {
        //extract the id from the token
        const userId = req.user;
        //extract the current password and new password from the body
        const { cuurentPassword, newPassword } = req.body;

        //find user by userId
        const user = await User.findById(userId);

        //if password is wrong
        if (!(await user.comparePassword(cuurentPassword))) {
            return res.status(401).json({ error: 'invalid password' });
        }

        //update the user password
        user.password = newPassword;
        await user.save();

        console.log("password updated");
        res.status(200).json({ error: 'password updated' });


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})




// Profile route
router.get('/profile', jwtAuthMidlleware, async(req, res) => {
    try {
        const userData = req.user;


        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
})

module.exports = router;