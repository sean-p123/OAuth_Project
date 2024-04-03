const jwt = require('jsonwebtoken');

function authenticateJWT(req:any, res:any, next:any) {
    //const token = req.headers.authorization;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("user: " + req.body.username)
    console.log("Token: "+ token)
    if(!token){
        return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    //verification failing for some reason , possibly the expire date .. req.user comes back undefined
    jwt.verify(token, process.env.JWT_WEB_SECRET, (err: any | null, decoded: any) => {
        if (err) {
            console.log("Decoded: " + jwt.decode(token))
            console.log("req.user: " + req.user);
            return res.status(401).json({ message: 'Authentication failed: Invalid token' });
        }
        
        console.log("Token Verified");
        // Attach the authenticated user information to the request object
        req.user = decoded;
        next();
    })
    
}
module.exports = authenticateJWT;