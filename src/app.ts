require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const oauthRouter = require('./routes/oauthRoute.ts');
const cabinetRoute = require('./routes/cabinetRoute.ts');
  // Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit:'200mb'}));

app.use('/oauth', oauthRouter);
app.use('/cabinets', cabinetRoute);

//pull all variables from .env file
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const response_type = process.env.RESPONSE_TYPE;
const scope = process.env.SCOPE;
const grant_type = process.env.GRANT_TYPE;

let accessToken;
let code;
// Login endpoint (with LDAP in production)
  app.get('/login', (req,res)=>{
    console.log("/login")
    console.log(client_id);

    //here, LDAP login will occur. 
    //If login successful, redirect to /authorize with necessary credentials
    //add the necessary credentials to the end of the url
    //needed: client_id, client_secret, redirect_uri, response_type, scope
    // Construct URL with parameters encoded in the query string
    //  const url = `/route?param1=${param1}&param2=${param2}`;
    res.redirect(`/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`);

  });

  app.get('/callback', async (req,res)=>{
    console.log("callback");
    //pull code from url
     code = req.query.code;
    console.log("Authorization code: " + code);
    console.log("client id: " + client_id)
    // Parameters required for the token endpoint request
    const tokenParams = {
      url: 'http://localhost:3000/oauth/token',
      method: 'POST',
      data: {
          client_id: client_id,
          client_secret: client_secret,
          redirect_uri: 'http://localhost:3000/callback',
          code: code,
          grant_type: grant_type
      }
  };
  try {
    console.log(tokenParams.data.grant_type)
    // Make a POST request to the token endpoint and await the response
    const response = await axios.post(tokenParams.url, tokenParams.data);
    console.log("token post req");

    // Handle successful response
    const accessToken = response.data.access_token;
  
    //use this token in the header of all requests to get access
    console.log(accessToken);
    res.json(response.data)

} catch (error) {
    // Handle error
    console.error('Error while requesting token:', error);
    res.status(500).send('Internal server error');
}
  })
app.listen(PORT, () => {
    console.log(`Authorization server is running on http://localhost:${PORT}`);
  });

