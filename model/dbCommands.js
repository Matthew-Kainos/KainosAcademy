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

exports.getRolesByBand = async (id) => { 
    return await db.query( 
        "SELECT * FROM JobRoles JOIN Band ON JobRoles.Band_ID "
        + "= Band.Band_ID WHERE JobRoles.Band_ID = ?", id); 
}

const db = wrapDB(dbconfig);