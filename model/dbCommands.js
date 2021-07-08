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

exports.getRoleAndBandDB = async (role) => { 
    return await db.query( 
        "SELECT JobRoles.Name AS 'Role', Band.Name As 'RoleBand' FROM JobRoles, Band WHERE JobRoles.Band_ID = Band.Band_ID AND JobRoles.Name = ?", role);
}

exports.getAllRolesAndBandDB = async () => { 
    return await db.query( 
        "SELECT JobRoles.Name AS 'Role', Band.Name As 'RoleBand' FROM JobRoles, Band WHERE JobRoles.Band_ID = Band.Band_ID");
}

const db = wrapDB(dbconfig);