const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//define the person schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String

    },
    moblie: {
        type: String,

    },
    address: {
        type: String,
        require: true
    },
    aadharCardNumber: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }

});

userSchema.pre('save', async function(next) {
    const User = this;
    //hash the password only if it has been modified(or is new)
    if (!User.isModified('password')) return next();
    try {
        //hash password generation
        const salt = await bcrypt.genSalt(10);
        //hash password
        const hashedPassword = await bcrypt.hash(User.password, salt);
        //overeride the plain password with hashed one
        User.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        //use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    } catch (err) {
        throw err;
    }
}

//create person model
const User = mongoose.model('User', userSchema);

module.exports = User;