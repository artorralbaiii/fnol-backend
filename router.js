// Custom Lib
let database = require('./controller')()

module.exports = (app, express) => {
    let api = express.Router()

    // Health Check
    api.get('/ping', database.ping)

    // GET 
    api.get('/policy/link/:initiator/:initiator_policy/:link_policy_num', database.fetchThirdPartyData)
    api.get('/policy/:policyid', database.getPolicy)
    api.get('/user/:userid', database.getUserData)
    api.get('/incident/:incidentid', database.getIncident)

    // POST
    api.post('/login', database.login)
    api.post('/incident/:policyid', database.createIncident)

    return api
}