const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        id: payload['sub'],
        email: payload['email'],
        name: payload['name'],
        profileImgUrl: payload['picture']
    }
}

module.exports = {
    verify: verify
}