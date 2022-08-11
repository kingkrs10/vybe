const { Pool, Client } = require("pg");
const pgp = require("pg-promise")({});

const connection_string =
  require("../config/config").relational_db.connection_string;

const pool = new Pool({
  connectionString: connection_string,
  ssl: {
    rejectUnauthorized: false,
  },
});

const client = pgp({ connection_string });

module.exports = {
  getClientFromPool: () => {
    return pool.connect();
  },
  pool,
  client,
  pgp,
};
