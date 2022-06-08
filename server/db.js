const Pool = require("pg").Pool;


const pool = new Pool({
    user: "postgres",
    password: "qwe",
    host: "localhost",
    port: 5432,
    database: "tumblr"
});


module.exports = pool;

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });

//   module.exports = pool;


