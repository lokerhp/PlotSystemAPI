const mariadb = require('mariadb');


const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,
    connectionLimit: process.env.DATABASE_CONNECTION_LIMIT,
    database: process.env.DATABASE_SCHEMA
})


// query() function
const query = async (sql, params) => {

    // Get a connection from the pool
    let conn = await pool.getConnection()
    .catch(err => {
        console.log("There was an error when creating the connection. Please retry.")
        reject(err);
    });

    // Execute the query
    let rows = await conn.query(sql, params)
    .catch(err => {
        console.log("There was an error when executing a SQL query. Error:")
        console.log(err)
        reject(err);
    })
    .finally(f => {
        console.log("Query executed. (" + sql + "). Params: " + params + "") 
        // Release the connection back to the pool
        conn.release();
    })

    return rows;
};




module.exports = {
  query
};
