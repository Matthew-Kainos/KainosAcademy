const mysql = require('mysql');
const util = require('util');
const DatabaseError = require('../errors/DatabaseError');

// eslint-disable-next-line import/no-unresolved
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

exports.getJobRoles = async () => {
  try {
    return await db.query(
      'SELECT JobRoles.Role_ID, JobRoles.name, Band.Level, Band.Name FROM JobRoles INNER JOIN Band ON JobRoles.Band_ID = Band.Band_ID ORDER BY Level, JobRoles.name',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getJobRoles with message: ${e.message}`);
  }
};

exports.getCapabilitiesBasedOnJobId = async (jobId) => {
  try {
    return await db.query(
      'SELECT Capabilities.cap_id, Capabilities.name FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id WHERE JobRoles.role_id = ? LIMIT 1;', jobId,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getCapabilitiesBasedOnJobId with message: ${e.message}`);
  }
};
exports.getCapabilityLead = async (familyID) => {
  try {
    return await db.query(
      'SELECT Capabilities.cap_ID, Capabilities.Name, Family.Family_ID, Family.Name AS JobFamily, Family.LeadName, Family.LeadMessage, Family.LeadImage FROM Capabilities LEFT JOIN Family ON Capabilities.cap_ID = Family.Cap_ID WHERE Family.Family_ID = ?;', familyID,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getCapabilityLead with message: ${e.message}`);
  }
};

exports.getCapabilitiesBasedOnJobName = async (name) => {
  try {
    return await db.query(
      'SELECT JobRoles.Name AS JobRoleName, Capabilities.cap_id, Capabilities.name AS CapabilityName FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id WHERE JobRoles.Name LIKE ? ORDER BY JobRoles.Role_ID;', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getCapabilitiesBasedOnJobName with message: ${e.message}`);
  }
};

exports.getAllJobsWithCapability = async () => {
  try {
    return await db.query(
      'SELECT JobRoles.Name AS JobRoleName, Capabilities.cap_id, Capabilities.name AS CapabilityName FROM Capabilities RIGHT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id ORDER BY Role_ID;',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getAllJobsWithCapability with message: ${e.message}`);
  }
};

exports.checkIfJobExists = async (name) => {
  try {
    return await db.query(
      'SELECT * FROM JobRoles WHERE Name = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfJobExists with message: ${e.message}`);
  }
};

exports.checkIfBandExists = async (name) => {
  try {
    return await db.query(
      'SELECT * FROM Band WHERE Name = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfBandExists with message: ${e.message}`);
  }
};

exports.getBandID = async (bandName) => {
  try {
    return await db.query(
      'SELECT Band_ID FROM Band WHERE Name = ?',
      [bandName],
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getBandID with message: ${e.message}`);
  }
};

exports.getTrainingID = async (trainingName) => {
  try {
    return await db.query(
      'SELECT Train_ID FROM Training WHERE Name = ?',
      [trainingName],
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getTrainingID with message: ${e.message}`);
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
      'SELECT Capabilities.Cap_ID, Family.Family_ID, Capabilities.Name AS CapName, Family.Name AS Job_Family FROM Capabilities, Family WHERE Family.Cap_ID = Capabilities.Cap_ID AND Capabilities.Name = ?;', capName,
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
      'SELECT Capabilities.Name AS Name, Family.Name AS Job_Family FROM Capabilities RIGHT JOIN Family ON Capabilities.Cap_ID = Family.Cap_ID ORDER BY Family.Name;',
    );
  } catch (e) {
    throw new DatabaseError(`Error calling getAllJobsWithCapability with message: ${e.message}`);
  }
};

exports.checkIfFamilyExists = async (familyName) => {
  try {
    return await db.query(
      'SELECT * FROM Family WHERE Name = ?', familyName,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling checkIfFamilyExists with message: ${e.message}`);
  }
};

exports.selectAllFamily = async () => db.query(
  'SELECT * FROM Family;',
);

exports.selectAllCapabilities = async () => db.query(
  'SELECT * FROM Capabilities;',
);

exports.selectAllJobRoles = async () => db.query(
  'SELECT * FROM JobRoles;',
);
