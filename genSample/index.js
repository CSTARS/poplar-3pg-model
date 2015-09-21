var fs = require('fs');
var model = require('../index.js');
var modelIO = require('../example/io.js');

model.setIO(modelIO);

// this can be in IO, but showing here
// set the planting params
model.manage = {
  datePlanted  : new Date(2014, 4, 1),
  dateCoppiced : new Date(2016, 9, 1),
  yearsPerCoppice : 3,
  fertility : 0.7,
  irrigFrac : 1
  // this will override dataCoppiced && yearsPerCoppice
  //coppiceDates : ['2016-08','2018-07','2020-09']
};

model.run(2);

var sample = {
  manage : model.manage,
  weather : model.weather,
  soil : model.soil,
  plantation : model.plantation
};

fs.writeFileSync(__dirname+'/../example/fullSampleInputs.json', JSON.stringify(sample, '  ', '  '));
