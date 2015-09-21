var model = require('../index.js');
var modelIO = require('./io.js');

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


model.debug = true;
var data;
/*if( process.argv.length > 2 ) {
  model.dailyStep = true;
  data = model.run(7300);
} else {
  data = model.run(240);
}*/
data = model.run(240);

data = model.run(7300);

for( var i = 0; i < data[0].length; i++ ) {
  console.log(data[0][i]+': '+data[data.length-1][i]);
}


console.log('done.');
