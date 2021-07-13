const mysql = require('mysql');
const util = require('util');
const dbconfig = require('../dbconfig.json');
const DatabaseError = require('../errors/DatabaseError');

function wrapDB(dbConfig) {
  const pool = mysql.createPool(dbConfig);
  return {
    query(sql, args) {
      console.log('Executing Query');
      return util.promisify(pool.query)
        .call(pool, sql, args);
    },
    release() {
      return util.promisify(pool.releaseConnection)
        .call(pool);
    },
  };
}

const db = wrapDB(dbconfig);

exports.checkIfUserExists = async (name) => {
  try {
    return await db.query(
      'SELECT Username FROM Users WHERE Username = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfUserExists with message: ${e.message}`);
  }
};

exports.getUsersPassword = async (name) => {
  try {
    return await db.query(
      'SELECT Password FROM Users WHERE Username=?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getUsersPassword with message: ${e.message}`);
  }
};

exports.checkIfAdmin = async (name) => {
  try {
    return await db.query(
      'SELECT * FROM Users WHERE Username=? AND isAdmin=1', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getUsersPassword with message: ${e.message}`);
  }
};
