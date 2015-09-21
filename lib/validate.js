/*
 * Validate a model run setup.  throw error is badness.
 */
var dataModel = require('./dataModel');

var paramError = 'Validation Error: ';

module.exports = function(model) {
  validatePlantation(model);
  validateManage(model);
  validateWeather(model);
  validateCustomWeather(model);
  validateSoil(model);
};

function validateManage(model) {
  if( !model.manage ) {
    throw paramError+'manage is not definied';
  }

  validateModel(dataModel.manage, model.manage, 'manage');

  if( model.manage.coppiceDates ) {
    if( !Array.isArray(model.manage.coppiceDates) ) {
      throw paramError+'manage.coppiceDates should be an array of date strings.';
    }

    for( var i = 0; i < model.manage.coppiceDates.length; i++ ) {
      if( model.manage.coppiceDates[i].match('^\d\d\d\d-\d\d$') ) {
        throw paramError+' invalid manage.coppiceDates format '+model.manage.coppiceDates[i]+'. should be YYYY-MM format.';
      }
    }
  } else {

    if( model.manage.dateCoppiced === undefined ) {
      throw paramError+' manage.dateCoppiced required if manage.coppiceDates not provided';
    }
    if( model.manage.yearsPerCoppice === undefined ) {
      throw paramError+' manage.yearsPerCoppice required if manage.coppiceDates not provided';
    }

  }
}

function validateWeather(model) {
  var hasCustomWeather = false;
  if( !model.custom_weather ) {
    hasCustomWeather = false;
  } else if( Object.keys(model.custom_weather) ) {
    hasCustomWeather = false;
  }

  // kinda hard to check badness if custom weather is defined;
  if( hasCustomWeather ) return;

  if( !model.weather ) {
    throw paramError+'No weather defined';
  }

  for( var i = 0; i < 11; i++ ) {
    if( model.weather[i+''] === undefined ) {
      throw paramError+' Month '+i+' not defined in weather';
    }
    var month = model.weather[i+''];
    validateModel(dataModel.weather, month, 'weather');
  }
}

function validateCustomWeather(model) {
  var hasCustomWeather = false;
  if( !model.customWeather ) {
    hasCustomWeather = false;
  } else if( Object.keys(model.customWeather) ) {
    hasCustomWeather = false;
  }

  if( !hasCustomWeather ) return;

  for( var monthKey in model.customWeather ) {
    if( !monthKey.match(/^\d\d\d\d-\d\d$/) ) {
      throw paramError+' invalid month date '+monthKey+'. Should be YYYY-MM format.';
    }

    var month = model.weather[monthKey];

    validateModel(dataModel.weather, month, 'weatherCustom');
  }
}

function validateSoil(model) {
  if( !model.soil ) {
    throw paramError+'soil is not definied';
  }

  validateModel(dataModel.soil, model.soil, 'soil');
}

function validatePlantation(model) {
  if( !model.plantation ) {
    throw paramError+'plantation is not definied';
  }
  validateModel(dataModel.plantation, model.plantation, 'plantation');

  if( !model.plantation.seedlingTree ) {
    throw paramError+'plantation.seedlingTree is not definied';
  }
  validateModel(dataModel.tree, model.plantation.seedlingTree, 'plantation.seedlingTree');

  if( !model.plantation.coppicedTree ) {
    throw paramError+'plantation.coppicedTree is not definied';
  }
  validateModel(dataModel.tree, model.plantation.coppicedTree, 'plantation.coppicedTree');
}

function validateModel(dataModel, model, name) {
  var key, item;

  for( key in dataModel.value ) {
    item = dataModel.value[key];
    if( item.required === false ) continue;

    if( model[key] === undefined ) {
      throw paramError+name+'.'+key+' is missing '+
            (item.description ? '('+item.description+')' : '');
    }

    if( typeof item.value === 'object' ) {
      validateModel(item, model[key], name+'.'+key);
    }
  }
}
