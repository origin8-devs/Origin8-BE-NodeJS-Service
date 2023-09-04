/** Third party dependencies*/
const { Router } = require('express');

/** Local dependencies and functions */


const { utility, generateToken } = require('./utils.controller');


const router = Router();


/** 
 * @todo - create a SaaS Stretegy for Yard Events API as a SaaS or Paas
 * Unmounted the signup route for Yard Events API distribution to be provided to TGS, solution
 * customized for Genetec.
 */
router
    .post(
        '/utility',
        utility,
    )
    .post(
        '/generate-jwt',
        generateToken,
    )

module.exports = router;
