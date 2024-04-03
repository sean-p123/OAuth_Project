const express2 = require('express');
const validateToken = require('../middleware/tokenValidation.ts');

const router1 = express2.Router();
//use validateToken as middleware to verify the user has been granted access
router1.get('/viewCabinets', validateToken, (req,res)=>{
    console.log("/view cabinets");
    console.log(req.headers)
    res.send("***All cabinet data here***");
})

module.exports = router1;