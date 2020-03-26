"use strict";

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    username: { type: String, required: true, index: { unique: true } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: true },
    dob: { type: String, required: true },
    mobile: { type: String, required: true },
    landLine: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    policies: [{ type: schema.Types.ObjectId, ref: 'Policy' }]
}, { timestamps: true });

userSchema.methods.comparePassword = function (password) {
    return password === this.password;
};

module.exports = mongoose.model('User', userSchema);