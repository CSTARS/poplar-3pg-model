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

var data = model.run(48);

console.log(data);
