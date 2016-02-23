var extend = require('extend');

module.exports = {
  read : function(model) {
    // set the weather
    model.weather = require('./data/weather_davis_ca');
    // set the soil
    model.soil = require('./data/soil_davis_ca');

    // use the default plantation values from the data model
    readDefaultPlantation(model);

    // use the default tree values from the data model
    readDefaultTree(model);
  },

  dump : function(rows) {
    // you can do stuff here when model is done
  }
};

function readDefaultTree(model) {
  var p = model.getDataModel().tree;
  model.tree = {};

  for( var key in p.value ) {
    // some tree values are nested
    if( typeof p.value[key].value === 'object' ) {
      model.tree[key] = {};

      for( var key2 in p.value[key].value ) {
        model.tree[key][key2] = p.value[key].value[key2].value;
      }
    } else {
      model.tree[key] = p.value[key].value;
    }
  }

  // setup the mature, post coppice, tree
  model.plantation.coppicedTree = model.tree;

  // setup seedling Tree
  model.plantation.seedlingTree = extend(true, {}, model.tree);
  model.plantation.seedlingTree.stemsPerStump = 1;
  model.plantation.seedlingTree.pfs.stemCnt = 1;
  model.plantation.seedlingTree.rootP = {
      LAITarget : 10,
      efficiency : 0.6,
      frac : 0.01
  };
}

function readDefaultPlantation(model) {
  var p = model.getDataModel().plantation;
  model.plantation = {};

  for( var key in p.value ) {
    model.plantation[key] = p.value[key].value;
  }
}
