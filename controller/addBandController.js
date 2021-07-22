exports.setTrainingforBand = async (newBandDetails, dbCommands, dbCommandsAdmin) => {
  if (typeof newBandDetails.training === 'string' && newBandDetails.training !== '') {
    const bandID = await dbCommands.getBandID(newBandDetails.name);
    const trainID = await dbCommands.getTrainingID(newBandDetails.training);
    await dbCommandsAdmin.setTrainingForBand(trainID[0].Train_ID, bandID[0].Band_ID);
  } else if (Array.isArray(newBandDetails.training)) {
    const bandID = await dbCommands.getBandID(newBandDetails.name);
    for (let i = 0; i < newBandDetails.training.length; i++) {
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
    Name: newBandDetails.name,
    Level: newLevel,
    Training: stringifyTraining(newBandDetails.training),
    Competencies: newBandDetails.competencies,
    Responsibilities: newBandDetails.responsiblities,
  };
  return data;
};
