const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const validPassword = require('../lib/passwordUtils').validPassword;

// const customFields = {
//     usernameField: 'uname',
//     passwordField: 'pw'
// };

const verifyCallback = async (username, password, done) => {
    try {
      const result = await connection.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
  
      if (!user) {
        return done(null, false, { message: 'User not found.' })
      };
  
      const isValid = validPassword(password, user.hash, user.salt);
  
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
  
    } catch (err) {
      return done(err);
    }
};
  
const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);



passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try {
      const result = await connection.query('SELECT * FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
});
