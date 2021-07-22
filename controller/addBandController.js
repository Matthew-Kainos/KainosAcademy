exports.setTrainingforBand = async (newBandDetails, dbCommands, dbCommandsAdmin) => {
  if (typeof newBandDetails.training === 'string' && newBandDetails.training !== '') {
    const bandID = await dbCommands.getBandID(newBandDetails.bandName);
    const trainID = await dbCommands.getTrainingID(newBandDetails.training);
    await dbCommandsAdmin.setTrainingForBand(trainID[0].Train_ID, bandID[0].Band_ID);
  } else if (Array.isArray(newBandDetails.training)) {
    const bandID = await dbCommands.getBandID(newBandDetails.bandName);
    for (let i = 0; i < newBandDetails.training.length; i += 1) {
      const trainID = await dbCommands.getTrainingID(newBandDetails.training[i]);
      await dbCommandsAdmin.setTrainingForBand(trainID[0].Train_ID, bandID[0].Band_ID);
    }
  } else { console.log('no training added'); }
};

function stringifyTraining(trainingStr) {
  if (Array.isArray(trainingStr)) {
    return trainingStr.toString();
  }
  return trainingStr;
}

exports.setAddBandQueryData = (newBandDetails, newLevel) => {
  const data = {
    Name: newBandDetails.bandName,
    Level: newLevel,
    Training: stringifyTraining(newBandDetails.training),
    Competencies: newBandDetails.competency,
    Responsibilities: newBandDetails.responsiblities,
  };
  return data;
};
