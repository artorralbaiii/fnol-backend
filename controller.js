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
        login: login,
        getPolicy: getPolicy,
        createIncident: createIncident
    }

    return ctrl

    function login(req, res) {
        let body = req.body

        // Authentication
        User.findOne({ username: body.username })
            .populate('policies')
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

        Policy.findById(id, (err, data) => {
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
        let incidentBody = req.body.incident
        let otherpartiesBody = req.body.otherparties

        let incidentModel = await new Incident(incidentBody).save();
        let otherPartyModel = await new Incident(otherpartiesBody).save();
        let policyModel = await Policy.findById(policyId);

        console.log('incidentModel', incidentModel)
        console.log('otherPartyModel', otherPartyModel)
        console.log('policyModel', policyModel)

        return policyModel;

    }


    // ********************************************************************** //
}


