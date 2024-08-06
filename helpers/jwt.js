const { expressjwt: jwt }  = require('express-jwt');
const { Module } = require('module');


function authJwt() {
    const secret = process.env.Secret;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked:isRevoked

    }).unless({
        
        path: [
            {
                url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']
            },
            '/api/v1/user/login',
            '/api/v1/user/register',
            

        ],
    })
}

async function isRevoked(req,jwt) {
    const payload = jwt.payload
    if (!payload.isAdmin) {
        return true        
    }
    return false
    ;
}

module.exports = authJwt;
