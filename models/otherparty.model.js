"use strict";

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var otherPartySchema = new schema({
    policyNumber: { type: String },
    vehicle: { type: String },
    plateNo: { type: String },
    contactNumber: { type: String },
    email: { type: String },
    owner: { type: String },
    driver: { type: String },
    license: { type: String },
    driverContact: { type: String },
    fetchedStatus: { type: Number, default: 0 },
    fetched: { type: Boolean, default: false },
}, { timestamps: true }, { usePushEach: true });

module.exports = mongoose.model('Other', otherPartySchema);

// problemRequests: [{type: schema.Types.ObjectId, ref: 'ProblemRequest'}],