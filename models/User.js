// Here we use the User model. However, the file you copied makes some references to the JWT library. You must edit models/User.js to remove those references in order for User.js to load. We aren’t using JWTs in this project.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'provide valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'provide password'],
        minlength: 6,
        // maxlength: 12,
    },
});

// UserSchema.pre('save', async function (next) {
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // next();
});

// UserSchema.methods.getName = function () {
//     return this.name;
// };

// UserSchema.methods.createJWT = function () {
//     // return jwt.sign({ userId: this._id, name: this.name }, 'jwtSecret', {
//     //     expiresIn: '30d',
//     // });
//     return jwt.sign(
//         { userId: this._id, name: this.name },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: process.env.JWT_LIFETIME,
//         }
//     );
// };

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
