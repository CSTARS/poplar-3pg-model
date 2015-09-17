var fn = require('fn');
var utils = require('utils');

function run(lengthOfGrowth) {

    var yearToCoppice; //year of the first or subsequent harvests
    var coppiceInterval; //the # of months in a single coppice cycle
    var monthToCoppice; //at which month the harvest is to be performed :: currently the tree will be cut at the beginning of that month

    //Read the input parameters into object 2 functions can be combined into 1.
    var plantation = {};

    //this.io.readAllConstants(plantation); //both tree constants and plantation/management constants

    var weatherMap = [];
    // real data, not average
    var customWeatherMap = {};

    var plantingParams = {};
    //plantation instead of datemap

    this.read(this);
    //this.io.readWeather(weatherMap, plantingParams, customWeatherMap); //at this point weather map is a map of weather json objects, indexed at month 0
    //also reads in the manage stuff (date coppice, etc) and soil parameters.

    var currentDate = this.plantingParams["datePlanted"];

    var plantedMonth = this.currentDate.getMonth();
    var currentMonth = this.currentDate.getMonth();


    //TODO: test no datecoppice as input
    if ( this.plantingParams["dateCoppiced"] != undefined ){
      yearToCoppice = this.plantingParams["dateCoppiced"].getYear();
      monthToCoppice = this.plantingParams["dateCoppiced"].getMonth();
      coppiceInterval = this.plantingParams["yearsPerCoppice"];
      willCoppice = true;
    }

    this.manage.coppice = false;

    var step = 0;

    var setup = {
      lengthOfGrowth : lengthOfGrowth,
      step : 0,
      plantedMonth : plantedMonth,
      currentDate : this.currentDate,
      currentMonth : currentMonth,
      yearToCoppice : yearToCoppice,
      monthToCoppice : monthToCoppice,
      coppiceInterval : coppiceInterval,
      weatherMap : weatherMap,
      customWeatherMap : customWeatherMap,
      plantation : plantation
    }

    this.runCurrentSetup(setup);
}

function runSetup(setup){
    var m = (setup.currentMonth+1)+'';
    if( m.length == 1 ) m = '0'+m;

    var weatherThisMonth;
    if( setup.customWeatherMap[setup.currentDate.getFullYear()+'-'+m] ) {
    	weatherThisMonth = setup.customWeatherMap[setup.currentDate.getFullYear()+'-'+m];
    } else {
    	weatherThisMonth = setup.weatherMap[setup.currentMonth];
    }

    var firstMonthResults = this.init(this.plantation, this.soil);

    var keysInOrder=[];
    for (var key in this.plantation_state){
      keysInOrder.push(key);
    }

    firstMonthResults.Date = (currentDate.getMonth()+1) + "/" + currentDate.getYear();

    var rows = []; //these will become rows

    utils.log("Results of the first month: " +firstMonthResults);

    rows.push(keysInOrder);

    var firstRow = [];
    for (var i = 0; i < keysInOrder.length; i++){
      var key = keysInOrder[i];
      utils.log(key  + ": " + firstMonthResults[key]);
      firstRow.push(firstMonthResults[key]);
    }

    rows.push(firstRow);

    var currentMonthResults = firstMonthResults;
    var nextMonthResults;

    for (var step = 1; step < setup.lengthOfGrowth; step++) {
      setup.currentDate.setMonth(setup.currentDate.getMonth() + 1); // add a month to current date

      utils.log("currentDate = " + setup.currentDate);
      setup.currentMonth = setup.currentDate.getMonth();

      //TODO: figure out willCoppice functionality
      if (setup.currentDate.getYear() == setup.yearToCoppice && setup.currentMonth == setup.monthToCoppice){
        utils.log("Time to Coppice!");
        this.manage.coppice = true;
        //TODO: update trees


        setup.yearToCoppice = setup.yearToCoppice + setup.coppiceInterval; //next coppice year

        rows.push(keysInOrder);
      } else {
        this.manage.coppice = false;
      }

      m = (setup.currentMonth+1)+'';
      if( m.length == 1 ) {
        m = '0'+m;
      }

      var weatherThisMonth;
	    if( setup.customWeatherMap[setup.currentDate.getFullYear()+'-'+m] ) {
	    	weatherThisMonth = setup.customWeatherMap[setup.currentDate.getFullYear()+'-'+m];
	    } else {
	    	weatherThisMonth = setup.weatherMap[setup.currentMonth];
	    }

      nextMonthResults = this.singleStep(this.plantation, this.soil, weatherThisMonth, this.manage, currentMonthResults); //TODO: switch up trees here when after the first harvest

      nextMonthResults.Date = (setup.currentDate.getMonth()+1)  + "/" + setup.currentDate.getYear();
      utils.log("\n Results of the next month: " + nextMonthResults);

      var thisRow = [];
      for (var i = 0; i < keysInOrder.length; i++) {
        var key = keysInOrder[i];
        utils.log( key  + ": " + nextMonthResults[key]);
        thisRow.push(nextMonthResults[key]);
      }

      currentMonthResults = nextMonthResults;
      rows.push(thisRow);
    }

    this.io.dump(rows);

    return rows;
}

function singleStep(plantation, soil, weather, manage, p) { //p = previous state
  var c = {}; //current state

  if (this.manage.coppice == true) { //change this guy for the month when coppice
    // Add in a stump margin....
    c.feedstockHarvest = p.feedstockHarvest + p.WS;
    c.coppiceCount = p.coppiceCount + 1;
    c.coppiceAge = 0;
    p.LAI=0;
    p.WS = 0;
    p.WF = 0;
    p.W = p.WR;
  } else {
    c.feedstockHarvest = p.feedstockHarvest;
    c.coppiceCount = p.coppiceCount;
    c.coppiceAge = p.coppiceAge + 1.0/12;
  }

  var tree; //tree
  if( c.coppiceCount == 0 ) { //TODO: check the case where we start with a coppiced multi stump tree
      tree = this.plantation.seedlingTree;
  } else {
      tree = this.plantation.coppicedTree;
  }

  c.StandAge = p.StandAge+1.0/12;
  var sla = fn.tdp(p.StandAge,tree.SLA);
  c.LAI = p.WF * 0.1 * sla; // Landsburg eq 9.5
  c.VPD = fn.VPD(weather.tmin, weather.tmax, weather.tdmean);
  c.fVPD = fn.fVPD(tree.kG, c.VPD);

  c.fSW = fn.fSW(p.ASW, soil.maxAWS, soil.swconst, soil.swpower);
  c.fAge=fn.tdp(p.StandAge,tree.fAge);
  c.fFrost = fn.fFrost(weather.tmin);
  c.PAR = fn.PAR(weather.rad);
  c.fT = fn.fT((weather.tmin+weather.tmax)/2, tree.fT);
  c.xPP = fn.xPP(tree.y, c.PAR);
  c.PhysMod = fn.PhysMod(c.fVPD, c.fSW, c.fAge);
  c.fNutr=fn.fNutr(tree.fN0, manage.fertility);
  c.NPP = fn.NPP(p.coppiceAge, tree.fullCanAge, c.xPP, tree.k, p.LAI, c.fVPD, c.fSW, c.fAge, tree.alpha, c.fNutr, c.fT, c.fFrost);

  var NPP_target = fn.NPP(tree.fullCanAge, tree.fullCanAge, c.xPP, tree.k, tree.rootP.LAITarget, c.fVPD, c.fSW, c.fAge, tree.alpha, c.fNutr, c.fT, c.fFrost);
  c.RootP = fn.coppice.RootP(c.NPP, NPP_target, p.WR, p.W, tree.pR.mx,tree.rootP.frac);

  if (tree.laVI && tree.laVI.constant ) { // Test for that function
    c.pfs = fn.coppice.pfs_via_VI(p.WS*1000000/plantation.StockingDensity, tree.wsVI,tree.laVI,sla);
  } else {
    c.pfs = fn.coppice.pfs(p.WS*1000/plantation.StockingDensity, tree.pfs);
  }

  c.dW = c.NPP+tree.rootP.efficiency*c.RootP;

  c.Intcptn = fn.Intcptn(c.LAI, tree.Intcptn);
  c.CanCond = fn.CanCond(c.PhysMod, c.LAI, tree.Conductance);

  c.pR = fn.pR(c.PhysMod,p.WR/p.W,manage.fertility,tree.pR);
  c.litterfall=fn.tdp(p.StandAge,tree.litterfall);

  c.Transp = fn.Transp(weather.rad, weather.daylight, c.VPD, tree.BLcond, c.CanCond);

  // Calculated from pfs
  c.pS = (1 - c.pR) / (1 + c.pfs );
  c.pF = (1 - c.pR) / (1 + 1/c.pfs );

  c.Irrig = fn.Irrig(manage.irrigFrac, c.Transp, c.Intcptn, weather.ppt);
  c.CumIrrig = p.CumIrrig + c.Irrig;

  c.ASW = fn.ASW(soil.maxAWS, p.ASW, weather.ppt, c.Transp, c.Intcptn, c.Irrig); //for some reason spelled maxAWS

  c.WF = p.WF + c.dW * c.pF - c.litterfall * p.WF;
  // Include contribution of RootP // Error in old code !
  c.WR = p.WR + c.dW * c.pR - tree.pR.turnover * p.WR - c.RootP;
  c.WS = p.WS + c.dW * c.pS;
  c.W = c.WF+c.WR+c.WS;

  return c;
}

function init(plantation, soil) {
  var p = {};
  var tree = plantation.seedlingTree; //TODO: decide the case where we start with a coppiced tree?

  p.feedstockHarvest=0;
  p.coppiceCount=0;
  p.coppiceAge = 0;

  p.CumIrrig =0;
  p.dW = 0;
  p.W = this.splantation.StockingDensity * this.plantation.SeedlingMass;
  p.WF = this.plantation.pF * p.W
  p.WS = this.plantation.pS * p.W;
  p.WR = this.plantation.pR * p.W;
  p.ASW = 0.8 * 10 * this.soil.maxAWS; // The 10 is because maxAWS is in cm and ASW in mm (?) Why (?)
  p.StandAge = 0;

  var tree = this.plantation.seedlingTree;

  // sla = Specific Leaf Area
  var sla = fn.tdp(p.StandAge,tree.SLA);

  p.LAI = p.WF * 0.1 * sla; // Landsburg eq 9.5

  // These aren't used so can be set to anything;  They are set to match the postgres type
  p.VPD=0;
  p.fVPD=0;
  p.fT =0;
  p.fFrost = 0;
  p.fNutr=0;
  p.fSW=0;
  p.fAge=0;
  p.PAR = 0;
  p.xPP = 0;
  p.Intcptn = 0;
  p.Irrig = 0;
  p.CanCond = 0;
  p.Transp = 0;
  p.PhysMod = 0;
  p.pfs = 0;
  p.pR=0;
  p.pS=0;
  p.pF=0;
  p.litterfall = 0;
  p.NPP = 0;
  p.RootP = 0;
  return p;
};

module.exports = function(io) {
  return {
    io : io
    run : run,
    runSetup : runSetup,
    init : init,
    setIo : function(io) {
      this.io = io;
    }
  }
}
