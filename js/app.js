"use strict";
// TODO: 
// - split file!
// - instead of the watch function, events might make sense
// - currently updating is a bit buggy, can probably be fixed by above

//TODO: move those functions into different file
var MapperFactory = function () {

  this.branch_use_colors =
  [
    "#000000",
    "#ffff00",
    "#1ce6ff",
    "#ff34ff",
    "#ff4a46",
    "#008941",
    "#006fa6",
    "#a30059",
    "#ffdbe5",
    "#7a4900",
    "#0000a6",
    "#63ffac",
    "#b79762",
    "#004d43",
    "#8fb0ff",
    "#997d87",
    "#5a0007",
    "#809693",
    "#feffe6",
    "#1b4400",
    "#4fc601",
    "#3b5dff",
    "#4a3b53",
    "#ff2f80",
    "#61615a",
    // "#ba0900", // used for main branch
    "#6b7900",
    "#00c2a0",
    "#ffaa92",
    "#ff90c9",
    "#b903aa",
    "#d16100",
    "#ddefff",
    "#000035",
    "#7b4f4b",
    "#a1c299",
    "#300018",
    "#0aa6d8",
    "#013349",
    "#00846f",
    "#372101",
    "#ffb500",
    "#c2ffed",
    "#a079bf",
    "#cc0744",
    "#c0b9b2",
    "#c2ff99",
    "#001e09",
    "#00489c",
    "#6f0062",
    "#0cbd66",
    "#eec3ff",
    "#456d75",
    "#b77b68",
    "#7a87a1",
    "#788d66",
    "#885578",
    "#fad09f",
    "#ff8a9a",
    "#d157a0",
    "#bec459",
    "#456648",
    "#0086ed",
    "#886f4c",
    "#34362d",
    "#b4a8bd",
    "#00a6aa",
    "#452c2c",
    "#636375",
    "#a3c8c9",
    "#ff913f",
    "#938a81",
    "#575329",
    "#00fecf",
    "#b05b6f",
    "#8cd0ff",
    "#3b9700",
    "#04f757",
    "#c8a1a1",
    "#1e6e00",
    "#7900d7",
    "#a77500",
    "#6367a9",
    "#a05837",
    "#6b002c",
    "#772600",
    "#d790ff",
    "#9b9700",
    "#549e79",
    "#fff69f",
    "#201625",
    "#72418f",
    "#bc23ff",
    "#99adc0",
    "#3a2465",
    "#922329",
    "#5b4534",
    "#fde8dc",
    "#404e55",
    "#0089a3",
    "#cb7e98",
    "#a4e804",
    "#324e72",
    "#6a3a4c",
    "#83ab58",
    "#001c1e",
    "#d1f7ce",
    "#004b28",
    "#c8d0f6",
    "#a3a489",
    "#806c66",
    "#222800",
    "#bf5650",
    "#e83000",
    "#66796d",
    "#da007c",
    "#ff1a59",
    "#8adbb4",
    "#1e0200",
    "#5b4e51",
    "#c895c5",
    "#320033",
    "#ff6832",
    "#66e1d3",
    "#cfcdac",
    "#d0ac94",
    "#7ed379",
    "#012c58"
  ];

  this.main_branch_color = "#ba0900";

  this.metric2color = {
    "branch_complexity": ["#f7fcfd",
      "#e5f5f9",
      "#ccece6",
      "#99d8c9",
      "#66c2a4",
      "#41ae76",
      "#238b45",
      "#005824"
    ],
    "commit_lang_complexity": ["#f7fcfd",
      "#e0ecf4",
      "#bfd3e6",
      "#9ebcda",
      "#8c96c6",
      "#8c6bb1",
      "#88419d",
      "#6e016b"
    ],
    "commit_message_length": ["#f7fcf0",
      "#e0f3db",
      "#ccebc5",
      "#a8ddb5",
      "#7bccc4",
      "#4eb3d3",
      "#2b8cbe",
      "#08589e"
    ],
    "commit_modularity": ["#fff7ec",
      "#fee8c8",
      "#fdd49e",
      "#fdbb84",
      "#fc8d59",
      "#ef6548",
      "#d7301f",
      "#990000"
    ],
    "most_edited_file": ["#fff7fb",
      "#ece7f2",
      "#d0d1e6",
      "#a6bddb",
      "#74a9cf",
      "#3690c0",
      "#0570b0",
      "#034e7b"
    ]
  };
  this.chunkNum = 8;
  // used to index into branch_use_colors
  this.branch_usage_gauge = 0;

  var outer = this;

  var EqualRangeMapper = function(maxValue, metricName, exp) {

    this._mappingInfo = null;
    exp = exp ? exp : 0;

    this.map = function(value) {
      var mappingInfos = this.getMappingInfo();
      for(var i = 0; i < mappingInfos.length; i++) {
        if (value <= mappingInfos[i].upperBound) {
          return mappingInfos[i].color;
        }
      }
      return mappingInfos[mappingInfos.length-1].color;
    };

    this.getMappingInfo = function() {
      if (this._mappingInfo) {
        return this._mappingInfo;
      }

      var step = maxValue/outer.chunkNum;
      var boundary = 0;
      var mappingInfo = [];

      for (var i = 0; i < outer.chunkNum; i++) {
        mappingInfo.push({
          lowerBound: Math.ceil10(boundary, exp),
          upperBound: Math.specialBoundFloor10(boundary+step, exp, maxValue),
          color: outer.metric2color[metricName][i]
        });
        boundary += step;
      }
      mappingInfo = mappingInfo.filter(function (mi) {
        return mi.lowerBound <= mi.upperBound;
      });

      var previousLowerBound = Number.MIN_VALUE;
      mappingInfo = mappingInfo.filter(function (mi) {
        if (mi.lowerBound == previousLowerBound) {
          return false;
        }
        previousLowerBound = mi.lowerBound;
        return true;
      });

      mappingInfo.map(function(mi) {
        if (mi.lowerBound == mi.upperBound) {
          mi.legendText = mi.lowerBound.toFixed(-exp);
        }
        else {
          mi.legendText = mi.lowerBound.toFixed(-exp) + '–' + mi.upperBound.toFixed(-exp);
        }
      });

      this._mappingInfo = mappingInfo;
      return this._mappingInfo;
    };

  };

  var FibonacciRangeMapper = function(maxValue, metricName) {

    this._mappingInfo = null;

    this.map = function(value) {
      var mappingInfos = this.getMappingInfo();
      for(var i = 0; i < mappingInfos.length; i++) {
        if (value <= mappingInfos[i].upperBound) {
          return mappingInfos[i].color;
        }
      }
      return mappingInfos[mappingInfos.length-1].color;
    };

    this.getMappingInfo = function() {
      if (this._mappingInfo) {
        return this._mappingInfo;
      }

      var mName = metricName;
      var mappingInfo = [];

      mappingInfo.push({
        lowerBound: 0,
        upperBound: 1,
        color: outer.metric2color[mName][0]
      });

      mappingInfo.push({
        lowerBound: 2,
        upperBound: 3,
        color: outer.metric2color[mName][1]
      });

      for (var i = 2; i < outer.chunkNum - 1; i++) {
        mappingInfo.push({
          lowerBound: Math.fibo(i+1)+1,
          upperBound: Math.fibo(i+2),
          color: outer.metric2color[mName][i]
        });
      }

      mappingInfo.push({
        lowerBound: Math.fibo(outer.chunkNum) + 1,
        upperBound: Number.MAX_VALUE,
        color: outer.metric2color[mName][outer.chunkNum-1]
      });

      mappingInfo.map(function(val) {
        if (val.upperBound < Number.MAX_VALUE) {
          val.legendText = val.lowerBound + '–' + val.upperBound;
        } else {
          val.legendText = val.lowerBound + '+';
        }
      });

      this._mappingInfo = mappingInfo;
      return mappingInfo;
    };
  };

  var BranchUsageMapper = function(maxValue) {
    this.colors = [outer.main_branch_color]; // color for the main branch
    var i = 1; // 0 is already #000000
    while(i < maxValue) {
      outer.branch_usage_gauge = (outer.branch_usage_gauge + 1) % outer.branch_use_colors.length;
      console.assert(outer.branch_use_colors[outer.branch_usage_gauge] !== undefined, "gauge was "+ outer.branch_usage_gauge+ " usable maxvalue: "+ outer.branch_use_colors.length);
      this.colors.push(outer.branch_use_colors[outer.branch_usage_gauge]);
      ++i;
    }
    this.map = function(value) {
      console.assert(this.colors[value-1] !== undefined, "mapping is broken, value was "+value, "number of colors which we can use: "+this.colors.length);
      return this.colors[value-1]; // values start with 1, arrays with 0
    };
    this.getMappingInfo = function() {
      var mappingInfo = [];
      for (var i = 0; i < this.colors.length; i++) {
        mappingInfo.push({
          lowerBound: i,
          upperBound: i,
          color: this.colors[i] 
        });
      }
      return mappingInfo;
    };
  };

  this.createMapper = function(maxValue, metricName) {
    switch (metricName) {
      case "branch_usage":
        return new BranchUsageMapper(maxValue);
      case "commit_message_length":
        return new FibonacciRangeMapper(maxValue, metricName);
      case "commit_modularity":
        return new EqualRangeMapper(maxValue, metricName, -2);
      default:
        return new EqualRangeMapper(maxValue, metricName, 0);
    }
  };
};

var mapperFactory = new MapperFactory();

function arrayMax(arr) {
  var max = arr[0];
  for (var i=0; i < arr.length; i++) {
    max = Math.max(max, arr[i]);
  }
  return max;
}

/**
 * Mozilla's decimal adjustment of a number.
 *
 * @param   {String}    type    The type of adjustment.
 * @param   {Number}    value   The number.
 * @param   {Number}    exp     The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number}            The adjusted value.
 */
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
  Math.round10 = function(value, exp) {
    return decimalAdjust('round', value, exp);
  };
}
// Decimal floor
if (!Math.floor10) {
  Math.floor10 = function(value, exp) {
    return decimalAdjust('floor', value, exp);
  };
}
// Decimal ceil
if (!Math.ceil10) {
  Math.ceil10 = function(value, exp) {
    return decimalAdjust('ceil', value, exp);
  };
}

// A special purpose bound floor. This function returns a non-inclusive floor (0.1-->0, 0.5-->0, 0.9-->0, 1-->0,
// 1.1-->0), unless the number is the maximum, in which case it returns that maximum.
Math.specialBoundFloor10 = function(value, exp, maxVal) {
  var result = decimalAdjust('floor', value, exp);
  if (result == value && result != maxVal) {
    return value - Math.pow(10, exp);
  } else {
    return result;
  }
};

Math.fibo = function(n) {
  if (n < 2) return 1;
  return Math.fibo(n-2) + Math.fibo(n-1);
};

var repogramsModule = angular.module('repogramsModule',[
						'repogramsDirectives',
						'repogramsControllers',
						'repogramsServices',
						'ui.bootstrap', 
						'ngAnimate', 
						'angular-loading-bar', 
						'vr.directives.slider']);
