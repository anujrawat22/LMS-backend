const jwt = require('jsonwebtoken');

function generateVerificationToken(userdata) {
    const secretKey = process.env.VERIFICATION_TOKEN_KEY;
    const expiresIn = '1d';

    const token = jwt.sign(userdata, secretKey, { expiresIn });
    return token;
}

module.exports = { generateVerificationToken };
