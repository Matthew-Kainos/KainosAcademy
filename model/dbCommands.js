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
//add to tests:
const db = wrapDB(dbconfig);

exports.getJobRoles = async () => { 
    try{
        return await db.query( 
            "SELECT Role_ID, JobRoles.Name, Level FROM JobRoles INNER JOIN Band ON JobRoles.Band_ID = Band.Band_ID ORDER BY Level");
    } catch(e) {
        throw new DatabaseError(`Error calling getCapabilitiesBasedOnJobId with message: ${e.message}`);
    }
}