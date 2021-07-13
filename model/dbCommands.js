const mysql = require('mysql');
const util = require('util');
const dbconfig = require('../dbconfig.json');
const DatabaseError = require('../errors/DatabaseError');

function wrapDB(dbConfig) {
  const pool = mysql.createPool(dbConfig);
  return {
    query(sql, args) {
      console.log('in query in wrapper');
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

exports.getCapabilityLead = async (capID) => {
  try {
    return await db.query(
      'SELECT Cap_ID, Name, Job_Family, LeadName, LeadMessage, LeadImage FROM Capabilities WHERE Cap_ID=?;', capID,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getCapabilityLead with message: ${e.message}`);
  }
};

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
