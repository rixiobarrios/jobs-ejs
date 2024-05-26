require('dotenv').config(); // to load the .env file into the process.env object
const express = require('express');
require('express-async-errors');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(require('body-parser').urlencoded({ extended: true }));

const session = require('express-session');
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: true,
//     })
// );

const MongoDBStore = require('connect-mongodb-session')(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
    // may throw an error, which won't be caught
    uri: url,
    collection: 'mySessions',
});
store.on('error', function (error) {
    console.log(error);
});

const sessionParams = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false, sameSite: 'strict' },
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sessionParams.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParams));

// You can now add the following lines to app.js, right after the app.use for session (Passport relies on session):
const passport = require('passport');
const passportInit = require('./passport/passportInit');

passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(require('connect-flash')());

// Now, we need a couple of app.use statements. Add these lines right after the connect-flash line:
app.use(require('./middleware/storeLocals'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/sessions', require('./routes/sessionRoutes'));

// secret word handling
// let secretWord = 'syzygy';
// app.get('/secretWord', (req, res) => {
//     res.render('secretWord', { secretWord });
// });
// app.post('/secretWord', (req, res) => {
//     secretWord = req.body.secretWord;
//     res.redirect('/secretWord');
// });

// Next let’s replace the app.get and app.post statements for the "/secretWord" routes in app.js with these lines:

const secretWordRouter = require('./routes/secretWord');
app.use('/secretWord', secretWordRouter);

// let secretWord = "syzygy"; <-- comment this out or remove this line
// app.get('/secretWord', (req, res) => {
//     if (!req.session.secretWord) {
//         req.session.secretWord = 'syzygy';
//     }
//     res.render('secretWord', { secretWord: req.session.secretWord });
// });

// app.get('/secretWord', (req, res) => {
//     if (!req.session.secretWord) {
//         req.session.secretWord = 'syzygy';
//     }
//     res.locals.info = req.flash('info');
//     res.locals.errors = req.flash('error');
//     res.render('secretWord', { secretWord: req.session.secretWord });
// });

// app.post('/secretWord', (req, res) => {
//     req.session.secretWord = req.body.secretWord;
//     res.redirect('/secretWord');
// });

// app.post('/secretWord', (req, res) => {
//     if (req.body.secretWord.toUpperCase()[0] == 'P') {
//         req.flash('error', "That word won't work!");
//         req.flash('error', "You can't use words that start with p.");
//     } else {
//         req.session.secretWord = req.body.secretWord;
//         req.flash('info', 'The secret word was changed.');
//     }
//     res.redirect('/secretWord');
// });

// Error handling
app.use((req, res) => {
    res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
    console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        // Then add this line to app.js, just before the listen line:
        await require('./db/connect')(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
