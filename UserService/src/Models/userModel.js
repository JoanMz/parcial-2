// usersModel.js

const mysql = require('mysql2');

// Connect to ySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // Pon tu contraseña aquí
  database: 'Social_2'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Función para crear un nuevo usuario
function createUser(username, password,  role, callback) {
  connection.query(
    'INSERT INTO users (username, password,  role) VALUES (?, ?, ?)',
    [username, password,  role],
    (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        callback(err, null);
        return;
      }
      callback(null, { id: result.insertId, username,  role });
    }
  );
}

// Función para autenticar un usuario
function authenticateUser(username, password, callback) {
  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Error authenticating user:', err);
        callback(err, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null);
        return;
      }
      const user = results[0];
      callback(null, user);
    }
  );
}

// Función para obtener todos los usuarios
function getAllUsers(callback) {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error getting users:', err);
      callback(err, null);
      return;
    }
    callback(null, results);
  });
}

// Función para seguir a un usuario
function followUser(followerId, followingId, callback) {
  connection.query(
    'INSERT INTO follows (followerId, followingId) VALUES (?, ?)',
    [followerId, followingId],
    (err, result) => {
      if (err) {
        console.error('Error following user:', err);
        callback(err, null);
        return;
      }
      callback(null, { followerId, followingId });
    }
  );
}

// Función para dejar de seguir a un usuario
function unfollowUser(followerId, followingId, callback) {
  connection.query(
    'DELETE FROM follows WHERE followerId = ? AND followingId = ?',
    [followerId, followingId],
    (err, result) => {
      if (err) {
        console.error('Error unfollowing user:', err);
        callback(err, null);
        return;
      }
      callback(null, { followerId, followingId });
    }
  );
}

module.exports = {
  createUser,
  authenticateUser,
  getAllUsers,
  followUser,
  unfollowUser	
};

