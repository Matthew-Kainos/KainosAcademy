const mysql = require('mysql'); 
const util = require ('util');
const dbconfig = require('../dbconfig.json'); 
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

exports.getCapabilitiesBasedOnJobId = async (jobId) => { 
    try{
        return await db.query( 
            "SELECT Capabilities.cap_id, Capabilities.name FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id WHERE JobRoles.role_id = ? LIMIT 1;", jobId);
    } catch(e) {
        throw new DatabaseError(`Error calling getCapabilitiesBasedOnJobId with message: ${e.message}`);
    }
}

exports.checkIfJobIdExists = async (jobId) => { 
    try{
        return await db.query( 
            "SELECT * FROM JobRoles WHERE ROLE_ID = ? LIMIT 10;", jobId);
        } catch(e) {
        throw new DatabaseError(`Error calling checkIfJobIdExists with message: ${e.message}`);
    }
}

exports.testInsertCapability = async (jobId) => { 
    try{
        return await db.query( 
            'INSERT INTO Capabilities values (90000, "TestName", "TestJobFamily","TestLeadName", "TestLeadMessage", 2)');
        } catch(e) {
        throw new DatabaseError(`Error calling testInsertCapability with message: ${e.message}`);
    }
}

exports.getRoleAndBandDB = async (role) => {
    try{ 
        return await db.query( 
            "SELECT JobRoles.Name AS 'Role', Band.Name As 'RoleBand' FROM JobRoles, Band WHERE JobRoles.Band_ID = Band.Band_ID AND JobRoles.Name = ?", role);
    } catch(e) {
        throw new DatabaseError(`Error calling getRoleAndBandDB with message: ${e.message}`);
    }
}

exports.getAllRolesAndBandDB = async () => { 
    try{
        return await db.query( 
            "SELECT JobRoles.Name AS 'Role', Band.Name As 'RoleBand' FROM JobRoles, Band WHERE JobRoles.Band_ID = Band.Band_ID");
    } catch(e) {
        throw new DatabaseError(`Error calling getAllRolesAndBandDB with message: ${e.message}`);
    }
}
