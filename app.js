require('dotenv').config(); // to load the .env file into the process.env object
const express = require('express');
require('express-async-errors');

const app = express();

// // Middleware
// app.set('view engine', 'ejs');
// app.use(require('body-parser').urlencoded({ extended: true }));

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

// // Middleware
app.set('view engine', 'ejs');
app.use(require('body-parser').urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
const csrf = require('host-csrf');

// You can use process.env.SESSION_SECRET as your cookie-parser secret.
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.urlencoded({ extended: false }));
let csrf_development_mode = true;
if (app.get('env') === 'production') {
    csrf_development_mode = false;
    app.set('trust proxy', 1);
}
const csrf_options = {
    protected_operations: ['PATCH'],
    protected_content_types: ['application/json'],
    development_mode: csrf_development_mode,
};
// const csrf_middleware = csrf(csrf_options); //initialize and return

//  Note that the app.use for the CSRF middleware must come after the cookie parser middleware and after the body parser middleware, but before any of the routes.
app.use(csrf(csrf_options));

// There is one more step. You need to make your application more secure! You should configure the helmet, xss-clean, and express-rate-limit packages, just as you did for Lesson 10. Then try the application out one more time. CORS is not needed in this case.
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.use(helmet());
app.use(xss());
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);

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
// })
// app.post('/secretWord', (req, res) => {
//     secretWord = req.body.secretWord;
//     res.redirect('/secretWord');
// });

// Next let’s replace the app.get and app.post statements for the "/secretWord" routes in app.js with these lines:

// new secret word handling
// const secretWordRouter = require('./routes/secretWord');
// app.use('/secretWord', secretWordRouter);

// latest secret word handling
const secretWordRouter = require('./routes/secretWord');
const auth = require('./middleware/auth');
app.use('/secretWord', auth, secretWordRouter);

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

// In app.js, require the jobs router, and add an app.use statement for it, at an appropriate place in the code. The app.use statement might look like:

// jobs router
const jobsRouter = require('./routes/jobs');
// You need to include the auth middleware in the app.use, because these are protected routes and the requester must be a logged on user.
app.use('/jobs', auth, jobsRouter);

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
