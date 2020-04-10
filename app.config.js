'use strict';
/*jshint -W101 */
module.exports = function () {
    var config = {
        env: {
            PORT: 6003,
            MONGO_DB: 'mongodb+srv://admin:passw0rd@cluster0-vzlo8.mongodb.net/fnol_db',
            C3_HOSTNAME: 'http://localhost:6004',
            C3_PORT: 6004
        }
    };

    return config;
};
/*jshint +W101 */