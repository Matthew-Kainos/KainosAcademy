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

exports.getCapabilitiesBasedOnJobName = async (name) => {
  try {
    return await db.query(
      'SELECT JobRoles.Name AS JobRoleName, Capabilities.cap_id, Capabilities.name AS CapabilityName FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id WHERE JobRoles.Name LIKE ? LIMIT 1;', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getCapabilitiesBasedOnJobName with message: ${e.message}`);
  }
};

exports.getAllJobsWithCapability = async () => {
  try {
    return await db.query(
      'SELECT JobRoles.Name AS JobRoleName, Capabilities.cap_id, Capabilities.name AS CapabilityName FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getAllJobsWithCapability with message: ${e.message}`);
  }
};

exports.checkIfJobExists = async (name) => {
  try {
    return await db.query(
      'SELECT * FROM JobRoles WHERE Name LIKE ? LIMIT 10;', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfJobExists with message: ${e.message}`);
  }
};

exports.getRoleAndBandDB = async (role) => {
  try {
    return await db.query(
      "SELECT JobRoles.Name AS 'Role', Band.Name As 'RoleBand' FROM JobRoles, Band WHERE JobRoles.Band_ID = Band.Band_ID AND JobRoles.Name = ?", role,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getRoleAndBandDB with message: ${e.message}`);
  }
};

exports.getAllRolesAndBandDB = async () => {
  try {
    return await db.query(
      "SELECT JobRoles.Name AS 'Role', Band.Name As 'RoleBand' FROM JobRoles, Band WHERE JobRoles.Band_ID = Band.Band_ID",
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getAllRolesAndBandDB with message: ${e.message}`);
  }
};

exports.getFamilyBasedOnCapability = async (capName) => {
  try {
    return await db.query(
      'SELECT Name, Job_Family FROM Capabilities WHERE Name = ?;', capName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getFamilyBasedOnCapability with message: ${e.message}`);
  }
};

exports.checkIfCapabilityExists = async (capName) => {
  try {
    return await db.query(
      'SELECT * FROM Capabilities WHERE Name = ? LIMIT 10;', capName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfCapabilityExists with message: ${e.message}`);
  }
};

exports.getJobSpec = async (roleID) => {
  try {
    return await db.query(
      'SELECT Name, Role_ID, Spec_Sum, Spec_Link'
            + ' FROM JobRoles WHERE Role_ID = ?',
      [roleID],
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getJobSpec with message: ${e.message}`);
  }
};

exports.getAllFamiliesWithCapability = async () => {
  try {
    return await db.query(
      'SELECT Name, Job_Family FROM Capabilities',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getAllFamiliesWithCapability with message: ${e.message}`);
  }
};

// MY CODE
exports.getCompentenciesBasesOnBand = async (bandName) => {
  try {
    return await db.query(
      'SELECT Name, Competencies FROM Band WHERE Name = ?;', bandName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getAllJobsWithCapability with message: ${e.message}`);
  }
};
// MY CODE
exports.checkIfBandExists = async (bandName) => {
  try {
    return await db.query(
      'SELECT * FROM Band WHERE Name = ? LIMIT 10;', bandName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfBandExists with message: ${e.message}`);
  }
};
