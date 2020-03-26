let User = require('./models/user.model')
let Policy = require('./models//policy.model')
let Incident = require('./models//incident.model')
let Other = require('./models//otherparty.model')
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
            .select('username password')
            .exec((err, data) => {
                if (err) {
                    res.json(returnError(JSON.stringify(err)))
                }

                if (!data) {
                    res.json(returnError('Invalid Username'))
                }

                try {
                    if (data.comparePassword(body.password)) {
                        res.json({
                            message: 'Authenticated',
                            success: true,
                            data: data
                        })
                    } else {
                        res.json(returnError('Invalid Password'))
                    }
                } catch (err) {
                    res.json(returnError(JSON.stringify(err)))
                }
            })
    }


    // ********************************************************************** //


    function getPolicy(req, res) {

        let _id = req.params.policyid
        let id = mongoose.Types.ObjectId(_id)

        Policy.findById(id)
            .populate('incidents', '-images')
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

    async function createIncident(req, res) {

        let policyId = req.params.policyid
        let otherpartiesBody = req.body.otherparties
        let incidentBody = req.body.incident

        let otherPartyModel = await new Other(otherpartiesBody).save();
        // let otherId = mongoose.Types.ObjectId(otherPartyModel._id)

        incidentBody.otherParty.push(otherPartyModel._id)

        let incidentModel = await new Incident(incidentBody).save();
        let policyModel = await Policy.findById(policyId);


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

        // policyModel.incidents.push(incidentModel._id)
        // policyModel.incidents.concat([incidentModel._id])

        // policyModel.save((err, data) => {
        //     if (err) {
        //         res.json(returnError(JSON.stringify(err)))
        //     } else {
        //         res.json({
        //             message: 'Successful Saved',
        //             success: true,
        //             data: data
        //         })
        //     }
        // });

        // let policyId = req.params.policyid
        // let incidentBody = req.body.incident
        // let otherpartiesBody = req.body.otherparties

        // let incidentModel = await new Incident(incidentBody).save();
        // let otherPartyModel = await new Incident(otherpartiesBody).save();
        // let policyModel = await Policy.findById(policyId);

        // console.log('incidentModel', incidentModel)
        // console.log('otherPartyModel', otherPartyModel)
        // console.log('policyModel', policyModel)

        // res.json(incidentModel)

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


