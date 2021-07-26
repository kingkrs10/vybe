const { Pool, Client } = require("pg");

const config = require("../config/config");

const pool = new Pool({
   user: config.relational_db.user,
   host: config.relational_db.cloudpath /* "localhost"*/,
   database: config.relational_db.name,
   password: config.relational_db.pass,
   port: config.relational_db.port,
   max: 10,
   idleTimeoutMillis: 10000,
   connectionTimeoutMillis: 11000,
});

module.exports = {
   getClientFromPool: () => {
      return pool.connect();
   },
};
