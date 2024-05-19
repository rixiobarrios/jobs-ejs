// Create a file routes/sessionRoutes.js, as follows:
// Ignore the passport lines for the moment. This just sets up the routes.

const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
    logonShow,
    registerShow,
    registerDo,
    logoff,
} = require('../controllers/sessionController');

router.route('/register').get(registerShow).post(registerDo);
// Finally, you can now uncomment the lines having to do with Passport in routes/sessionRoutes.js, so that the require statement for Passport is included, and so that the route for logon looks like:
router
    .route('/logon')
    .get(logonShow)
    .post(
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/sessions/logon',
            failureFlash: true,
        })
        // (req, res) => {
        //     res.send('Not yet implemented.');
        // }
    );
router.route('/logoff').post(logoff);

module.exports = router;
