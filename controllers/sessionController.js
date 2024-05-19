//  We need to create a corresponding file controllers/sessionController.js. Here we use the User model. However, the file you copied makes some references to the JWT library.

const User = require('../models/User');
const parseVErr = require('../util/parseValidationErrors');

const registerShow = (req, res) => {
    res.render('register');
};

const registerDo = async (req, res, next) => {
    if (req.body.password != req.body.password1) {
        req.flash('error', 'The passwords entered do not match.');
        return res.render('register', { errors: flash('errors') });
    }
    try {
        await User.create(req.body);
    } catch (e) {
        if (e.constructor.name === 'ValidationError') {
            parseVErr(e, req);
        } else if (e.name === 'MongoServerError' && e.code === 11000) {
            req.flash('error', 'That email address is already registered.');
        } else {
            return next(e);
        }
        return res.render('register', { errors: flash('errors') });
    }
    res.redirect('/');
};

const logoff = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
};

// const logonShow = (req, res) => {
//     if (req.user) {
//         return res.redirect('/');
//     }
//     res.render('logon', {
//         errors: req.flash('error'),
//         info: req.flash('info'),
//     });
// };

// Since we’re letting Passport handle setting the req.flash properties now, we can remove the lines in controllers/sessionController.js that set the flash messages for the loginShow handler. So that should now just look like:
const logonShow = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('logon');
};

module.exports = {
    registerShow,
    registerDo,
    logoff,
    logonShow,
};
