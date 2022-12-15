const mariadb = require('mariadb');


const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT
});

const query = async (sql, params) => {

    return new Promise((resolve, reject) => {
        // Get a connection from the pool
        pool.getConnection()
        .then(conn => {

            // Execute the query
            const rows = conn.query(sql, params)
            .then(r => {
                console.log(r); // [{ "1": 1 }]
                resolve(r);
            })
            .catch(err => {
                console.log("There was an error when executing a SQL query. Error:")
                console.log(err)
                reject(err);
            })
            .finally(f => {
                // Release the connection back to the pool
                conn.release();
            })
        })
        .catch(err => {
            console.log("There was an error when creating the connection. Please retry.")
        });

        
    });
};

module.exports = {
  query
};
