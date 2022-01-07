const { Pool } = require("pg");
const pgp = require("pg-promise")({});

const db_config = require("../config/config").relational_db;

const pool = new Pool({
   user: db_config.user,
   host: db_config.cloudpath /* "localhost"*/,
   database: db_config.database,
   password: db_config.pass,
   port: db_config.port,
   max: 10,
   idleTimeoutMillis: 10000,
   connectionTimeoutMillis: 11000,
});

const dbclient = pgp({
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.pass,
  database: db_config.database,
});


module.exports = {
   getClientFromPool: () => {
      return pool.connect();
   },
   dbclient,
   pgp
};
