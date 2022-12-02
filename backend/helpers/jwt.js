var expressjwt = require("express-jwt");

function authJwt(){
    const secret = process.env.secret;
    return expressjwt({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"]},
            {url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"]},
            {url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"]},
            "/api/v1/users/login",
            "/api/v1/users/register"
        ]
    });
}

async function isRevoked(req, payload, done) {
    if(!payload.adminCheck) {
        done(null, true)
    }
    done();
}

module.exports = authJwt;