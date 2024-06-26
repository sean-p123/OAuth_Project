const express1 = require('express')
const jsonwebtoken = require('jsonwebtoken');
//const { Router } = express1;

const router = express1.Router();

//test data
const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'user' },
    { id: 2, username: 'admin', password: 'admin', role: 'admin' }
  ];

  let user;

// Authorization endpoint
router.get('/authorize', (req, res) => {
    console.log("/authorize")
    const { client_id, redirect_uri, response_type, scope } = req.query;
  
    // Check if client_id, redirect_uri, response_type are valid
    if (!client_id || !redirect_uri || !response_type) {
      return res.status(400).send('Invalid request parameters');
    }
  
    // Simulate user authentication
    user = users.find(user => user.id === 1); // Assuming user with id 1 is authenticated
  
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
    
    console.log("before req")
    //console.log(req.body)

    if (code !== "abc123") {
        return res.status(400).send('Invalid authorization code');
    }


    // Validate grant_type 
    if (grant_type !== process.env.GRANT_TYPE) {
        return res.status(400).send('Unsupported grant type');
    }

    // Validate client credentials
    if (client_id !== process.env.CLIENT_ID || client_secret !== process.env.CLIENT_SECRET) {
        return res.status(401).send('Unauthorized: Invalid client credentials');
    }

    //generate access token here
    const accessToken = jsonwebtoken.sign(user, client_secret, { expiresIn: '1h' });
    console.log("token:" + accessToken)
    //const accessToken = 'xyz789'; // mock access token
    res.json({
        access_token: accessToken,
        token_type: 'bearer',
        expires_in: 3600 // 1 hour
    });
});

module.exports = router;