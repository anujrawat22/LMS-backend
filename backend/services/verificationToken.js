const jwt = require('jsonwebtoken');

function generateVerificationToken(userId) {
    const secretKey = process.env.VERIFICATION_TOKEN_KEY;
    const expiresIn = '1d';

    const token = jwt.sign({ userId }, secretKey, { expiresIn });
    return token;
}

module.exports = { generateVerificationToken };
