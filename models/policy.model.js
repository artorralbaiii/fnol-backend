"use strict";

const mongoose = require('mongoose')
const schema = mongoose.Schema
const _ = require('underscore')
const http = require('http')
const config = require('../app.config')();

let policySchema = new schema({
    plateNo: { type: String },
    issueDate: { type: String },
    policyNumberLocal: { type: String },
    policyNumber: { type: String },
    termFrom: { type: String },
    effectivityDate: { type: Date },
    effectivityDateLocal: { type: Date },
    status: { type: String },
    premium: { type: Number },
    termTo: { type: String },
    docStamps: { type: Number },
    localGovTax: { type: Number },
    otherCharges: { type: Number },
    totalSumInsured: { type: Number },
    itemInsured: { type: String },
    mortgagee: { type: String },
    vat: { type: Number },
    owner: { type: schema.Types.ObjectId, ref: 'User' },
    contractAddress: { type: String },
    linkPolicy: [{ type: Object }],
    provider: {type: String}
}, { timestamps: true }, { usePushEach: true });

// incidents: [{ type: schema.Types.ObjectId, ref: 'Incident' }],

// let policySchema = new schema({
//     premium: { type: Number },
//     vat: { type: Number },
//     docStamps: { type: Number },
//     localGovTax: { type: Number },
//     otherCharges: { type: Number },
//     totalSumInsured: { type: Number },
//     itemInsured: { type: String },
//     mortgagee: { type: String },
//     owner: { type: schema.Types.ObjectId, ref: 'User' },
//     contractAddress: { type: String },
//     policy: { type: Object }
// }, { timestamps: true }, { usePushEach: true });

policySchema.post('findOne', (result, next) => {
    http.get((process.env.C3_HOSTNAME || config.env.C3_HOSTNAME) + '/api/contracts/' + result.contractAddress, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData)
                let pickPolicy = {}

                if (parsedData.success) {
                    pickPolicy = _.pick(parsedData.data, 'policy')
                }

                _.extendOwn(result, pickPolicy.policy)
            } catch (e) {
                console.error(e.message);
            }
            next()
        });

    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`)
        next()
    })

})

module.exports = mongoose.model('Policy', policySchema)