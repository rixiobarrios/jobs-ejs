// We want to protect any route for the "/secretWord" path. The best practice is to put the code for those routes into a router file, as follows.

// routes/secretWord.js:
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.secretWord) {
        req.session.secretWord = 'syzygy';
    }

    res.render('secretWord', { secretWord: req.session.secretWord });
});

router.post('/', (req, res) => {
    if (req.body.secretWord.toUpperCase()[0] == 'P') {
        req.flash('error', "That word won't work!");
        req.flash('error', "You can't use words that start with p.");
    } else {
        req.session.secretWord = req.body.secretWord;
        req.flash('info', 'The secret word was changed.');
    }

    res.redirect('/secretWord');
});

module.exports = router;
