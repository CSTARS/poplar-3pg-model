module.exports = {
  description : "Crop Management Parameters",
  value : {
    irrigFrac : {
      value : 1,
      units : "",
      description : "Irrigation fraction: 1 = fully irrigated, 0 = no irrigation. Any values between 0 and 1 are acceptable"
    },
    fertility : {
      value : 0.7,
      units : "",
      description : "Soil fertility"
    },
    DatePlanted : {
        value : "_date_",
        units : "date",
        description : "Date the crop was planted"
    },
    DateCoppiced : {
        value : "_date_",
        units : "date",
        description : "Date of the first coppice"
    },
    CoppiceInterval : {
        value : 3,
        units : "Years",
        description : "How after the crop is coppiced after the first coppice"
    },
    DateFinalHarvest : {
        value : "_date_",
        units : "date",
        description : "Date when the crop is completely harvested"
    }
  }
};
