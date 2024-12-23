import mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost', // or your database host
    user: 'root', // your database user
    password: '', // your database password
    database: 'stage' // your database name
});

// Function to get a connection from the pool
const getConnection = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return callback(err);
        }
        callback(null, connection);
    });
};

export { getConnection };