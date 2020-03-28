"use strict";

var mongoose = require('mongoose')
var schema = mongoose.Schema

var policyLinkSchema = new schema({
    author: { type: schema.Types.ObjectId, ref: 'User' },
    authorPolicy: { type: schema.Types.ObjectId, ref: 'Policy' },
    linkedPolicy: { type: schema.Types.ObjectId, ref: 'Policy' },
    statusCode: {type: Number, default: 0},
    status: {type: String, default: 'Awaiting Permission'},
}, { timestamps: true })

module.exports = mongoose.model('LinkPolicy', policyLinkSchema)