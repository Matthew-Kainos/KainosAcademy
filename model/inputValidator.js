
exports.getRolesByBand = async (dbContext, band) => {
    try{
        const Role = band.replace('_', ' ');
        if(!/^[a-zA-Z\s]*$/.test(Role)) { return 'Error: Invalid input (can only enter letters and numbers)'; }
        const results = await dbContext.getRoleAndBandDB(Role);
        console.log(results);
        return results;
    } catch(e){
        console.log(e);
    }
}