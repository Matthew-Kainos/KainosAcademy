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

exports.getEmployees = async () => { 
    return await db.query( 
        "SELECT * FROM Employee");
}

exports.getJobSpec = async (Role_ID) => {
    return await db.query(
       "SELECT Name, Role_ID, Spec_Sum, Spec_Link"
       + " FROM JobRoles WHERE Role_ID = ?",
       [Role_ID])
 }

const db = wrapDB(dbconfig);