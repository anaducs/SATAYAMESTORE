const { expressjwt: jwt }  = require('express-jwt');
const { Module } = require('module');


function authJwt() {
    const secret = process.env.Secret;
    return jwt({
        secret,
        algorithms:['HS256']

    })
}

module.exports = authJwt;