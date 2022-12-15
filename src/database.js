const mariadb = require('mariadb');

// Create a pool with the environment variables
const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
    database: process.env.DATABASE_SCHEMA
});


// query() function
const query = async (sql, params) => {

    return new Promise((resolve, reject) => {
        // Get a connection from the pool
        pool.getConnection()
        .then(conn => {

            // Execute the query
            conn.query(sql, params)
            .then(rows => {
                if(process.env.DEBUG == 'true')
                    console.log("SQL result: " + JSON.stringify(rows[0])); // { "1": 1 }

                resolve(rows);
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
