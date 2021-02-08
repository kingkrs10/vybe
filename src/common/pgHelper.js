const { Pool, Client } = require("pg");

const config = require("../config/config");

const dbSocketPath = process.env.DB_SOCKET_PATH || "/cloudsql";

const pool = new Pool({
   user: config.relational_db.user,
   host: `${dbSocketPath}/luhu-development:us-east1:luhu-development-postgres`,
   database: config.relational_db.name,
   password: config.relational_db.pass,
   max: 10,
   idleTimeoutMillis: 10000,
   connectionTimeoutMillis: 11000,
});

module.exports = {
   getClientFromPool: () => {
      return pool.connect();
   },
};
