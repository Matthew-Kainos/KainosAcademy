/* eslint-disable import/no-unresolved */
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

exports.testInsertUser = async (userTestDetails) => {
  try {
    return await db.query(
      'INSERT INTO Users values (?,?,?)', [
        userTestDetails.username,
        userTestDetails.password,
        userTestDetails.isAdmin,
      ],
    );
  } catch (e) {
    throw new DatabaseError(`Error calling testInsertUser with message: ${e.message}`);
  }
};

exports.testDeleteUser = async (name) => {
  try {
    return await db.query(
      'DELETE FROM Users WHERE Username = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling testDeleteUser with message: ${e.message}`);
  }
};

exports.testInsertCapability = async (capabilityTestDetails) => {
  try {
    return await db.query(
      'INSERT INTO Capabilities values (?, ?, ?, ?, ?, ?, ?)', [
        capabilityTestDetails.capId,
        capabilityTestDetails.name,
        capabilityTestDetails.jobFamily,
        capabilityTestDetails.leadName,
        capabilityTestDetails.leadMessage,
        capabilityTestDetails.familyId,
        capabilityTestDetails.leadImage],
    );
  } catch (e) {
    throw new DatabaseError(`Error calling testInsertCapability with message: ${e.message}`);
  }
};

exports.testDeleteCapability = async (name) => {
  try {
    return await db.query(
      'DELETE FROM Capabilities WHERE Name = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling testDeleteCapability with message: ${e.message}`);
  }
};

exports.testInsertJobRole = async (jobRoleTestDetails) => {
  try {
    return await db.query(
      'INSERT INTO JobRoles values (?, ?, ?, ?, ?, ?)', [
        jobRoleTestDetails.roleId,
        jobRoleTestDetails.name,
        jobRoleTestDetails.specSum,
        jobRoleTestDetails.specLink,
        jobRoleTestDetails.capId,
        jobRoleTestDetails.bandId],
    );
  } catch (e) {
    console.log(e);
    throw new DatabaseError(`Error calling testInsertCapability with message: ${e.message}`);
  }
};

exports.testDeleteJobRole = async (name) => {
  try {
    return await db.query(
      'DELETE FROM JobRoles WHERE Name = ?', name,
    );
  } catch (e) {
    console.log(e);
    throw new DatabaseError(`Error calling testDeleteJobRole with message: ${e.message}`);
  }
};

exports.testInsertFamily = async (familyTestDetails) => {
  try {
    return await db.query(
      'INSERT INTO Family values (?, ?)', [
        familyTestDetails.familyId,
        familyTestDetails.name],
    );
  } catch (e) {
    console.log(e);
    throw new DatabaseError(`Error calling testInsertFamily with message: ${e.message}`);
  }
};

exports.testDeleteFamily = async (name) => {
  try {
    return await db.query(
      'DELETE FROM Family WHERE Name = ?', name,
    );
  } catch (e) {
    console.log(e);
    throw new DatabaseError(`Error calling testDeleteFamily with message: ${e.message}`);
  }
};

exports.testInsertBand = async (bandTestDetails) => {
  try {
    return await db.query(
      'INSERT INTO Band values (?, ?, ?, ?, ?, ?)', [
        bandTestDetails.bandId,
        bandTestDetails.name,
        bandTestDetails.level,
        bandTestDetails.training,
        bandTestDetails.competencies,
        bandTestDetails.responsibility],
    );
  } catch (e) {
    console.log(e);
    throw new DatabaseError(`Error calling testInsertBand with message: ${e.message}`);
  }
};

exports.testDeleteBand = async (name) => {
  try {
    return await db.query(
      'DELETE FROM Band WHERE Name = ?', name,
    );
  } catch (e) {
    throw new DatabaseError(`Error calling testDeleteBand with message: ${e.message}`);
  }
};
