const { Pool, Client } = require("pg");

const config = require("../config/config");

const pool = new Pool({
   user: config.relational_db.user,
   host: config.relational_db.host,
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
