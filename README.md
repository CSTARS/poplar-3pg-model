# poplar-3pg-model
3PG Poplar Growth Model

The Advanced Hardwood Biofuels Northwest project, AHB-NW investigates using poplar as a feedstock source for drop in gasoline replacement in the Pacific Northwest. UC Davis, is part of the sustainability group and created this for popular growth modeling.

You can find web application actively using the model here: [poplarmodel.org](http://poplarmodel.org)

The Advanced Hardwood Biofuels Northwest project homepage is here: [hardwoodbiofuels.org](http://hardwoodbiofuels.org/)


## Running Model

Checkout the [example/index.js](example/index.js) for how to setup the model and run.

You can see an example of all parameters required to run the model here: [example/fullSampleInputs.json](example/fullSampleInputs.json)

#### The basics

Install from NPM
```
npm install poplar-3pg-model
```

Run model

```
var model = require('poplar-3pg-model');

// set input parameters to model (again see example/fullSampleInputs.json);
setParams(model);

// run model for 100 months

try {
  var results = model.run(100);
} catch(e) {
  // the model will preform simple validation an throw errors if
  // inputs are is missing.
}
```
