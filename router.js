// Custom Lib
let database = require('./controller')()

module.exports = (app, express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', database.ping)

    // GET 
    api.get('/incident/:incidentid', database.getIncident)
    api.get('/link/:policyid', database.getLinkedPolicy)
    api.get('/policy/verify/:policy', database.verifyPolicy)
    api.get('/policy/link/:initiator/:initiator_policy/:link_policy_num', database.fetchThirdPartyData)
    api.get('/policy/:policyid', database.getPolicy)
    api.get('/user/:userid', database.getUserData)

    // POST
    api.post('/incident/:policyid', database.createIncident)
    api.post('/link/:linkid', database.linkPolicyAction)
    api.post('/login', database.login)
    api.post('/policy/requestlink', database.requestLink)

    return api
}