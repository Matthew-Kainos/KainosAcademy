const mysql = require('mysql'); 
const dbconfig = require('../dbconfig.json'); 
const util = require ('util');

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
    return await db.query( 
    "SELECT Capabilities.cap_id, Capabilities.name FROM Capabilities LEFT JOIN JobRoles ON Capabilities.cap_id = JobRoles.cap_id WHERE JobRoles.role_id = ? LIMIT 1;", jobId);
    }


exports.allJobIds = async () => { 
    return await db.query( 
        "SELECT ROLE_ID FROM JobRoles LIMIT 1000;");
}

exports.getFamilyBasedOnCapability = async (capId) => { 
    return await db.query( 
        "SELECT Name, Job_Family FROM Capabilities WHERE Cap_ID = ? LIMIT 1000;", capId);
}