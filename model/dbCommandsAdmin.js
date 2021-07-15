const mysql = require('mysql');
const util = require('util');
const DatabaseError = require('../errors/DatabaseError');

require('dotenv').config();

const dbconfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: process.env.DB_CON_LIMIT,
  database: process.env.DB_DATABASE,
};

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

exports.getAllBandNames = async () => {
  try {
    return await db.query(
      'SELECT Name FROM Band',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getUsersPassword with message: ${e.message}`);
  }
};

exports.getAllCapabilityNames = async () => {
  try {
    return await db.query(
      'SELECT Name FROM Capabilities',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getUsersPassword with message: ${e.message}`);
  }
};

exports.addNewRole = async (jobRoleDetails) => {
  try {
    return await db.query(
      'INSERT INTO JobRoles (Name, Spec_Sum, Spec_Link, Cap_ID, Band_ID) values (?, ?, ?, ?, ?)', [
        jobRoleDetails.roleName,
        jobRoleDetails.specSum,
        jobRoleDetails.specLink,
        jobRoleDetails.capId,
        jobRoleDetails.bandId],
    );
  } catch (e) {
    console.log(e);
    throw new DatabaseError(`Error calling testInsertCapability with message: ${e.message}`);
  }
};

exports.getCapabilityIdFromName = async (capabilityName) => {
  try {
    return await db.query(
      'SELECT Cap_ID FROM Capabilities WHERE Name = ?', capabilityName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getCapabilityIdFromName with message: ${e.message}`);
  }
};

exports.getBandIdFromName = async (bandName) => {
  try {
    return await db.query(
      'SELECT Band_Id As `BandID` FROM Band WHERE Name = ?', bandName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getBandIdFromName with message: ${e.message}`);
  }
};

exports.checkInsertRole = async (name) => {
  try {
    return await db.query(
      'SELECT * FROM JobRoles WHERE Name = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkInsertRole with message: ${e.message}`);
  }
};
