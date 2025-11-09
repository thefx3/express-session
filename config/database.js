// const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 * 
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */ 

const connection = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  });

connection.connect()
.then(() => console.log('✅ Connected to PostgreSQL'))
.catch((err) => console.error('❌ PostgreSQL connection error:', err));


// const conn = process.env.DB_STRING;

// const connection = mongoose.createConnection(conn, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
// const UserSchema = new mongoose.Schema({
//     username: String,
//     hash: String,
//     salt: String
// });


// const User = connection.model('User', UserSchema);

// Expose the connection
module.exports = connection;
