const mysql = require('mysql'); 
const dbconfig = require('../dbconfig.json'); 
const util = require ('util');
const DatabaseError = require('../errors/DatabaseError'); 

function wrapDB (dbconfig) { 
    const pool = mysql.createPool(dbconfig) 
    return { 
        query(sql, args) { 
            console.log("in query in wrapper") 
            return util.promisify( pool.query ) 
            .call(pool, sql, args) 
        }, 
        release () { 
            return util.promisify( pool.releaseConnection ) 
            .call( pool ) 
        } 
    } 
}

const db = wrapDB(dbconfig);

exports.getCapabilitiesBasedOnJobName = async (name) => { 
    try{
        return await db.query( 
            "SELECT JobRoles.Name AS JobRoleName, Capabilities.cap_id, Capabilities.name AS CapabilityName FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id WHERE JobRoles.Name LIKE ? LIMIT 1;", name);
    } catch(e) {
        throw new DatabaseError(`Error calling getCapabilitiesBasedOnJobName with message: ${e.message}`);
    }
}


exports.getAllJobsWithCapability = async () => { 
    try{
        return await db.query( 
            "SELECT JobRoles.Name AS JobRoleName, Capabilities.cap_id, Capabilities.name AS CapabilityName FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id");
        } catch(e) {
        throw new DatabaseError(`Error calling getAllJobsWithCapability with message: ${e.message}`);
    }
}

exports.checkIfJobExists = async (name) => { 
    try{
        return await db.query( 
            "SELECT * FROM JobRoles WHERE Name LIKE ? LIMIT 10;", name);
        } catch(e) {
        throw new DatabaseError(`Error calling checkIfJobExists with message: ${e.message}`);
    }
}

exports.getFamilyBasedOnCapability = async (capName) => { 
    try{
    return await db.query( 
        "SELECT Name, Job_Family FROM Capabilities WHERE Name = ?;", capName);
    } catch(e) {
        throw new DatabaseError(`Error calling getFamilyBasedOnCapability with message: ${e.message}`);
    }
}

exports.checkIfCapabilityExists = async (capName) => { 
    try{
        return await db.query( 
            "SELECT * FROM Capabilities WHERE Name = ? LIMIT 10;", capName);
        } catch(e) {
            
        throw new DatabaseError(`Error calling checkIfCapabilityExists with message: ${e.message}`);
    }
}

