const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '668014446614-es30fq9a3smq4b3qope65q1ahd9onpqn.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        id: payload['sub'],
        email: payload['email'],
        name: payload['name'],
        profileImgUrl: payload['picture']
    }
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  
  module.exports = {
      verify: verify
  }