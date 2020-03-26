// Custom Lib
let database = require('./controller')();

module.exports = (app, express) => {
    let api = express.Router()

    // GET 
    api.get('/policy/:policyid', database.getPolicy)

    // POST
    api.post('/login', database.login)
    api.post('/incident/:policyid', database.createIncident)

    return api
}