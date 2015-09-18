var model = require('../index.js');
var modelIO = require('./io.js');

model.setIO(modelIO);

// this can be in IO, but showing here
// set the planting params
model.plantingParams = {
  datePlanted  : new Date(2014, 4, 1),
  dateCoppiced : new Date(2016, 9, 1),
  yearsPerCoppice : 3
};

model.manage = {
  irrigFrac : 1, // how much irrigation (0-1);
  fertility : 0.7 // Soil fertility
};

var data = model.run(48);

console.log(data);
