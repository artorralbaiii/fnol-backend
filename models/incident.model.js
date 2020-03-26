"use strict";

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var incidentSchema = new schema({
    dateOfAccident: { type: Number },
    timeOfAccident: { type: Number },
    location: { type: String },
    images: [{ type: String }],
    descriptionOfLoss: { type: String },
    otherParty: [{ type: schema.Types.ObjectId, ref: 'Other' }],
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);

// problemRequests: [{type: schema.Types.ObjectId, ref: 'ProblemRequest'}],