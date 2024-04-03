express
const validateToken = require('../middleware/tokenValidation.ts');

//use validateToken as middleware to verify the user has been granted access
router.get('/viewCabinets', validateToken, (req,res)=>{
    console.log("/view cabinets");
    res.send("***All cabinet data here***");
})