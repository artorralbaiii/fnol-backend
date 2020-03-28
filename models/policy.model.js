"use strict";

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var policySchema = new schema({
    policyNumber: { type: String },
    plateNo: { type: String },
    issueDate: { type: String },
    termFrom: { type: String },
    termTo: { type: String },
    premium: { type: Number },
    vat: { type: Number },
    docStamps: { type: Number },
    localGovTax: { type: Number },
    otherCharges: { type: Number },
    totalSumInsured: { type: Number },
    itemInsured: { type: String },
    mortgagee: { type: String },
    incidents: [{ type: schema.Types.ObjectId, ref: 'Incident' }],
    owner: { type: schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }, { usePushEach: true });

module.exports = mongoose.model('Policy', policySchema);