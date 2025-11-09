const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const { isAuth } = require('./authMiddelware');
const { isAdmin } = require('./authMiddelware');

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/login-success',
        failureRedirect: '/login-failure'
    })
);

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required.');
        }

        const existingUser = await connection.query(
            'SELECT 1 FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rowCount > 0) {
            return res.status(409).send('Username is already taken.');
        }

        const { salt, hash } = genPassword(password);

        await connection.query(
            'INSERT INTO users (username, hash, salt, admin) VALUES ($1, $2, $3, $4)',
            [username, hash, salt, admin]
        );

        return res.redirect('/login');

    } catch (err) {
        return next(err);
    }
});


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="/register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
});

router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You made it to the USER route');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('You made it to the ADMIN route');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/protected-route');
    });
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;
