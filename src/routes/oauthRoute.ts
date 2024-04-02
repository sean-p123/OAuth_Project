const express1 = require('express')
//const { Router } = express1;

const router = express1.Router();


const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'user' },
    { id: 2, username: 'admin', password: 'admin', role: 'admin' }
  ];


// Authorization endpoint
router.get('/authorize', (req, res) => {
    console.log("/authorize")
    const { client_id, redirect_uri, response_type, scope } = req.query;
  
    // Check if client_id, redirect_uri, response_type are valid
    if (!client_id || !redirect_uri || !response_type) {
      return res.status(400).send('Invalid request parameters');
    }
  
    // Simulate user authentication
    const user = users.find(user => user.id === 1); // Assuming user with id 1 is authenticated
  
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
  
    // Simulate user authorization (scope validation)
    const authorizedScopes = ['user']; // Simulated authorized scopes
    const requestedScopes = scope.split(' ');
  
    if (requestedScopes.some(scope => !authorizedScopes.includes(scope))) {
      return res.status(403).send('Forbidden: Scope not authorized');
    }
  
    // Generate authorization code (assuming simplified implementation)
    const authorizationCode = 'abc123'; // Simulated authorization code
  
    // Redirect user back to client with authorization code
    res.redirect(`${redirect_uri}?code=${authorizationCode}`);
  });


// Token endpoint
router.post('/token', (req, res) => {
    console.log("/token");

    const { code, client_id, client_secret, redirect_uri, grant_type } = req.body;
    //const grant_type = req.body.grant_type;
    console.log("before req")
    console.log(req.data)

    if (code !== "abc123") {
        console.log("code: " + code);
       // return res.status(400).send('Invalid authorization code');
    }

    // Validate grant_type (for demonstration, we'll only handle 'authorization_code' grant type)
    if (grant_type !== process.env.GRANT_TYPE) {
//        return res.status(400).send('Unsupported grant type');
    }

    // Validate client credentials (you should compare with stored client credentials)
    if (client_id !== process.env.CLIENT_ID || client_secret !== process.env.CLIENT_SECRET) {
       // return res.status(401).send('Unauthorized: Invalid client credentials');
    }

    // Simulate exchanging authorization code for access token
    // In a real implementation, this would involve validating the authorization code,
    // generating and returning an access token, and optionally a refresh token.

    const accessToken = 'xyz789'; // Simulated access token
    res.json({
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 3600 // Access token expiration time in seconds (e.g., 1 hour)
    });
});
module.exports = router;