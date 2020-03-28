const userFiles = './user_upload/'
const fs = require('fs')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile);

let User = require('./models/user.model')
let Policy = require('./models/policy.model')
let LinkPolicy = require('./models/policylink.model')
let Incident = require('./models/incident.model')
let Other = require('./models/otherparty.model')
let mongoose = require('mongoose')

let returnError = (message) => {
    return { message: message, success: false, data: null }
}

module.exports = () => {

    let ctrl = {
        createIncident: createIncident,
        login: login,
        getIncident: getIncident,
        getPolicy: getPolicy,
        fetchThirdPartyData: fetchThirdPartyData,
        getUserData: getUserData,
        ping: ping
    }

    return ctrl

    function ping(req, res) {
        res.send('ok');
    }

    function login(req, res) {
        let body = req.body

        // Authentication
        User.findOne({ username: body.username })
            .select('username password firstName lastName middleName')
            .exec((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                    return
                }

                if (!data) {
                    res.json(returnError('Invalid Username'))
                    return
                }

                try {
                    if (data.comparePassword(body.password)) {
                        res.json({
                            message: 'Authenticated',
                            success: true,
                            data: data
                        })
                        return
                    } else {
                        res.json(returnError('Invalid Password'))
                        return
                    }
                } catch (err) {
                    res.json(returnError(JSON.stringify(err)))
                    return
                }
            })
    }


    // ********************************************************************** //

    function getPolicy(req, res) {

        let _id = req.params.policyid
        let id = mongoose.Types.ObjectId(_id)

        Policy.findById(id)
            .populate({
                path: 'incidents',
                populate: {
                    path: 'otherParty'
                }
            })
            .exec((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {
                    res.json({
                        message: 'Successful Fetch',
                        success: true,
                        data: data
                    })
                }
            })

    }

    function fetchThirdPartyData(req, res) {
        // :initiator/:initiator_policy/:link_policy_num
        let initiator = req.params.initiator
        let initiatorId = mongoose.Types.ObjectId(initiator)
        let initiatorPolicy = req.params.initiator_policy
        let initiatorPolicyId = mongoose.Types.ObjectId(initiatorPolicy)
        let policynum = req.params.link_policy_num

        Policy.findOne({ policyNumber: policynum })
            .populate('owner')
            .populate({
                path: 'incidents',
                populate: {
                    path: 'otherParty'
                }
            })
            .exec((err, policyData) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {

                    if (policyData) {

                        LinkPolicy.findOne({
                            $or: [
                                {
                                    $and: [{ authorPolicy: policyData._id }, { linkedPolicy: initiatorPolicyId }]
                                },
                                {
                                    $and: [{ authorPolicy: initiatorPolicyId }, { linkedPolicy: policyData._id }]
                                }
                            ]
                        }, (err, linkData) => {
                            if (err) {
                                res.json(returnError(JSON.stringify(err)))
                            } else {
                                if (linkData) {
                                    if (linkData.statusCode === 1) {
                                        res.json({
                                            message: 'Linked Data Successfully Fetched',
                                            success: true,
                                            data: policyData,
                                            linkStatus: linkData.statusCode
                                        })
                                    } else {
                                        res.json({
                                            message: linkData.status,
                                            success: true,
                                            data: null,
                                            linkStatus: linkData.statusCode
                                        })
                                    }

                                } else {
                                    let policyLink = new LinkPolicy({
                                        author: initiatorId,
                                        authorPolicy: initiatorPolicyId,
                                        linkedPolicy: policyData._id
                                    });

                                    policyLink.save((err, data) => {
                                        if (err) {
                                            res.json(returnError(JSON.stringify(err)))
                                        } else {
                                            res.json({
                                                message: 'Link Data Is Initiated',
                                                success: true,
                                                data: null,
                                                linkStatus: 0
                                            })
                                        }
                                    })

                                }
                            }
                        });

                    } else {
                        res.json({
                            message: 'Policy Not Found',
                            success: false,
                            data: null
                        })
                    }

                }
            })

    }


    // ********************************************************************** //

    async function createIncident(req, res) {

        let policyId = req.params.policyid
        let otherBody = req.body.others
        let imagesBody = req.body.images
        let incidentBody = req.body.incident
        let otherArray = []
        let imagesArray = []


        // Saving Other Parties

        for (let i = 0; i < otherBody.length; i++) {
            try {
                let otherPartyModel = await new Other(otherBody[i]).save()
                otherArray.push(otherPartyModel._id)
            } catch (err) {
                console.log('Saving Other Parties: ' + err);
            }
        }

        incidentBody.otherParty = otherArray

        let incidentModel = await new Incident(incidentBody).save()

        for (let i = 0; i < imagesBody.length; i++) {
            let base64data = imagesBody[i].replace(/^data:.*,/, '')
            let fname = incidentModel._id + '_' + i + '.png'

            try {
                await writeFile(userFiles + fname, base64data, 'base64')
                imagesArray.push(fname)
            } catch (error) {
                console.log(error)
            }

        }

        incidentModel.images = imagesArray
        incidentModel.save();

        Policy.findOne({ _id: policyId })
            .select('incidents')
            .exec((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {
                    data.incidents.push(incidentModel._id)

                    data.save((err, data) => {
                        if (err) {
                            res.json(returnError(JSON.stringify(err)))
                        } else {
                            res.json({
                                message: 'Successful Saved',
                                success: true,
                                data: data
                            })
                        }
                    })
                }
            })

    }


    // ********************************************************************** //

    function getUserData(req, res) {
        let _id = req.params.userid
        let id = mongoose.Types.ObjectId(_id)

        User.findById(id)
            .populate('policies')
            .exec((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {
                    res.json({
                        message: 'Successful Fetch',
                        success: true,
                        data: data
                    })
                }
            })
    }

    // ********************************************************************** //


    function getIncident(req, res) {

        let _id = req.params.incidentid
        let id = mongoose.Types.ObjectId(_id)

        Incident.findById(id)
            .populate('otherParty')
            .exec((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                } else {
                    res.json({
                        message: 'Successful Fetch',
                        success: true,
                        data: data
                    })
                }
            })

    }

    // ********************************************************************** //
}
