"use strict";
// TODO: 
// - split file!
// - instead of the watch function, events might make sense
// - currently updating is a bit buggy, can probably be fixed by above

//TODO: move those functions into different file
var MapperFactory = function () {

  this.branch_use_colors =
    [
      "#ba0900",
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

  // Used results of the second image here:
  // http://godsnotwheregodsnot.blogspot.com/2012/09/color-distribution-methodology.html
  this.commit_author = [
    "#fcfd0c",
    "#fca4fa",
    "#09dafc",
    "#d86606",
    "#03883f",
    "#153cfd",
    "#ab0344",
    "#00fbb4",
    "#f9d2c0",
    "#5d4c01",
    "#7d7b86",
    "#0d5252",
    "#a29204",
    "#188ef7",
    "#370257",
    "#f4717c",
    "#d90dcb",
    "#9bb2a1",
    "#7f2b00",
    "#6dc50b",
    "#b8cbfb",
    "#034204",
    "#058e9e",
    "#534049",
    "#fea912",
    "#f3fdfb",
    "#977dea",
    "#06335a",
    "#e60e1f",
    "#676e58",
    "#2f0102",
    "#e3febc",
    "#725493",
    "#a9937c",
    "#926455",
    "#fde5fe",
    "#03669e",
    "#b579a0",
    "#382000",
    "#0bb687",
    "#930177",
    "#d8c37c",
    "#fe966f",
    "#3d3e2e",
    "#a0f8ed",
    "#9d6b06",
    "#63760a",
    "#b5aab6",
    "#ed167d",
    "#879d5c",
    "#001c07",
    "#117b6b",
    "#efafbb",
    "#90556f",
    "#83adc0",
    "#22172c",
    "#516b73",
    "#1bb8b6",
    "#5b0036",
    "#9102cc",
    "#0b0ab0",
    "#03fc4e",
    "#700717",
    "#01252d",
    "#b48b8a",
    "#cec8b8",
    "#798a86",
    "#96cb8b",
    "#fd5ac2",
    "#bac500",
    "#41474f",
    "#6572a7",
    "#6a5f58",
    "#c48b47",
    "#c0525b",
    "#a45211",
    "#ae9fd3",
    "#fed019",
    "#d06e55",
    "#c0f85a",
    "#3e4f9b",
    "#2f613f",
    "#603d2e",
    "#877150",
    "#bcebfe",
    "#619376",
    "#d96dfa",
    "#1c6cfe",
    "#5a3161",
    "#02b1fa",
    "#08ab3c",
    "#016800",
    "#a81c1f",
    "#9c4afe",
    "#e6b380",
    "#85a1fb",
    "#cbe7d1",
    "#455315",
    "#723542",
    "#00073a",
    "#9072ad",
    "#32211f",
    "#5e5e74",
    "#28dcc1",
    "#fef2cc",
    "#a7539a",
    "#c4cdd5",
    "#175066",
    "#764910",
    "#fe4209",
    "#8c8b6f",
    "#0ad36d",
    "#8091ab",
    "#fc8a26",
    "#533391",
    "#91caca",
    "#a1a29e",
    "#4b9002",
    "#1d3f2e",
    "#404060",
    "#f8f08e",
    "#2e82aa",
    "#d2a716",
    "#eb88b0",
    "#7c6c1b",
    "#201c07",
    "#f1e6e5",
    "#d6a593",
    "#7e676e",
    "#dfc4fa",
    "#03727a",
    "#ab9c63",
    "#88a301",
    "#bf0172",
    "#fe0e55",
    "#695bd0",
    "#283104",
    "#65814c",
    "#1a988c",
    "#531a02",
    "#cfa4c6",
    "#aa744d",
    "#b6bd91",
    "#485a51",
    "#8b7c75",
    "#614f34",
    "#a9f5be",
    "#a66d76",
    "#9b879a",
    "#8bcefe",
    "#03b0ca",
    "#bfd579",
    "#232730",
    "#858440",
    "#72a3a2",
    "#cd4302",
    "#17e4e7",
    "#88463d",
    "#fe9a92",
    "#6b516e",
    "#161f70",
    "#b5513d",
    "#2f002b",
    "#c899fe",
    "#44202d",
    "#80c4a6",
    "#58776e",
    "#d46483",
    "#880d4b",
    "#68017c",
    "#a3aec4",
    "#c286cc",
    "#e2e5fc",
    "#beada5",
    "#1c241f",
    "#678f9e",
    "#9456bc",
    "#2c4142",
    "#413508",
    "#cd003b",
    "#fdc3e9",
    "#efced2",
    "#b28405",
    "#45382d",
    "#fd4d48",
    "#fdd8a3",
    "#98ed83",
    "#72736f",
    "#02081d",
    "#8e6d8a",
    "#afb357",
    "#6d82df",
    "#65a86d",
    "#d38251",
    "#b40aa5",
    "#d1539e",
    "#ba62c5",
    "#302451",
    "#735054",
    "#676339",
    "#833697",
    "#1a010a",
    "#c5b08d",
    "#0637b8",
    "#5404de",
    "#c1dcdb",
    "#b84e71",
    "#189bc6",
    "#fd17f3",
    "#5b310a",
    "#447b59",
    "#8a5e39",
    "#036e8b",
    "#7d3a66",
    "#0c9969",
    "#55091f",
    "#fe7331",
    "#aa340a",
    "#fcc465",
    "#496c32",
    "#bf8772",
    "#9d8145",
    "#687888",
    "#1a57d8",
    "#d5c9d9",
    "#787394",
    "#a19291",
    "#0d78cd",
    "#a6a58c",
    "#8ef1fd",
    "#3c4d2f",
    "#5c6064",
    "#95595b",
    "#c57675",
    "#0a4c7e",
    "#4ed49d",
    "#93bc5c",
    "#bf7103",
    "#006151",
    "#a1b9ba",
    "#adaafd",
    "#c9a8ab",
    "#4e2521",
    "#febbaf",
    "#0afeec",
    "#d3015b",
    "#f97a66",
    "#da9099",
    "#54044f",
    "#78e800",
    "#558a88",
    "#5dab98",
    "#94959e",
    "#d5dfb6",
    "#766afd",
    "#7e5b06",
    "#595846",
    "#4f6480",
    "#f4fde6",
    "#869a7f",
    "#5da9fd",
    "#8f8bb2",
    "#7a2efc",
    "#b709e6",
    "#012c28",
    "#bebcdf",
    "#fe7af0",
    "#d50d9a",
    "#e1d052",
    "#fde9d5",
    "#203a49",
    "#5f610a",
    "#67a72b",
    "#402e45",
    "#1c1003",
    "#894928",
    "#022c07",
    "#860203",
    "#321201",
    "#748b0a",
    "#3b7b0b",
    "#de8d01",
    "#6b42ba",
    "#fe4d98",
    "#943a58",
    "#cde70c",
    "#caa35d",
    "#d6fef9",
    "#feba97",
    "#80fbd7",
    "#6b8168",
    "#b9ac0b",
    "#cd38fc",
    "#5a535a",
    "#bdc8b3",
    "#8a9ba1",
    "#745748",
    "#8bcbe0",
    "#a53f48",
    "#2d2926",
    "#555584",
    "#067138",
    "#11d92d",
    "#5e324a",
    "#6b99bc",
    "#3ac0ec",
    "#cc9873",
    "#f906b8",
    "#17233d",
    "#fba467",
    "#bb6237",
    "#8e8b84",
    "#313a75",
    "#7d082f",
    "#396762",
    "#957c00",
    "#957a7f",
    "#549349",
    "#5c4a45",
    "#a3d424",
    "#722d1e",
    "#9491d7",
    "#8cb18a",
    "#487c89",
    "#dbedfd",
    "#280318",
    "#4a0202",
    "#53c7d3",
    "#a1dac9",
    "#450487",
    "#021a2a",
    "#020157",
    "#a1796c",
    "#7a7650",
    "#bf8ea2",
    "#3b3845",
    "#fea3d5",
    "#484723",
    "#dbcea7",
    "#004c29",
    "#cbc4c4",
    "#ad8eb7",
    "#7e6ec1",
    "#dab9a0",
    "#64bc60",
    "#aacba9",
    "#fddb80",
    "#ad67ec",
    "#ab6188",
    "#6d0aaa",
    "#1d0832",
    "#24301e",
    "#4f4d49",
    "#38585d",
    "#394c64",
    "#94b8dc",
    "#d64d47",
    "#911c2c",
    "#426ab2",
    "#2ea1a7",
    "#d7ddd4",
    "#03f385",
    "#b1685c",
    "#2c581e",
    "#721757",
    "#6bc8bb",
    "#955902",
    "#fe4879",
    "#874b85",
    "#cfa4e5",
    "#471c3d",
    "#e1f790",
    "#e584c9",
    "#c1fee1",
    "#95983e",
    "#ddbbce",
    "#08bea6",
    "#506a55",
    "#fbf7ea",
    "#837c6b",
    "#6f696f",
    "#524077",
    "#583d05",
    "#9a7e65",
    "#49236c",
    "#a382cc",
    "#b7bdb8",
    "#816b5d",
    "#6860a7",
    "#0c8281",
    "#466700",
    "#b4d1e8",
    "#dfdb9a",
    "#308b71",
    "#a33582",
    "#2b232b",
    "#5e82a8",
    "#f5b70b",
    "#716853",
    "#657138",
    "#059ae1",
    "#e9a24f",
    "#fe7198",
    "#d98f84",
    "#bbe4a7",
    "#cc0300",
    "#7c868d",
    "#a3a0ba",
    "#b09062",
    "#755f36",
    "#02bd0a",
    "#729488",
    "#573439",
    "#f6e108",
    "#544a5e",
    "#d45433",
    "#78de90",
    "#c0ac55",
    "#42291c",
    "#776287",
    "#4b738d",
    "#011315",
    "#dd6cd3",
    "#868303",
    "#da6ea3",
    "#024149",
    "#393d3a",
    "#120b15",
    "#e15964",
    "#525f39",
    "#d88029",
    "#455966",
    "#6f7b70",
    "#909b90",
    "#03b668",
    "#b19387",
    "#fefdbd",
    "#af6624",
    "#ddcbbf",
    "#0b6070",
    "#0c7051",
    "#dd3f68",
    "#a67c8d",
    "#5f6c68",
    "#4c361b",
    "#7b82ba",
    "#fe95ab",
    "#92d659",
    "#f3f5fd",
    "#049625",
    "#8ae0ba",
    "#606ed6",
    "#986f3d",
    "#b94586",
    "#b1933e",
    "#2f5548",
    "#aa6ba8",
    "#5da1b1",
    "#9aa67c",
    "#647b7e",
    "#74465a",
    "#c03231",
    "#9f593b",
    "#714a2d",
    "#080f00",
    "#465bf9",
    "#708e3f",
    "#e0bbb3",
    "#dd6937",
    "#9eb92d",
    "#423a3b",
    "#666e87",
    "#8d5f9d",
    "#003c90",
    "#b39bb0",
    "#afb0b5",
    "#accabe",
    "#e4bf4c",
    "#382f19",
    "#6cbf86",
    "#74687b",
    "#84b7ad",
    "#afe5e3",
    "#040082",
    "#4b4bc2",
    "#d3f8ce",
    "#fb0739",
    "#709262",
    "#e0d6f8",
    "#c1cae1",
    "#91a3ce",
    "#c6bcfc",
    "#798099",
    "#2b384f",
    "#02a487",
    "#8a8efd",
    "#0d58ac",
    "#8e3620",
    "#3b483b",
    "#78b6c0",
    "#464300",
    "#bc80fd",
    "#e1a6a2",
    "#9c38b9",
    "#938360",
    "#171c01",
    "#337ffc",
    "#c07b8a",
    "#762f74",
    "#843f01",
    "#e08465",
    "#cc972b",
    "#c4b1d0",
    "#5cabd1",
    "#f96642",
    "#b5ad9e",
    "#455050",
    "#87fea7",
    "#3e011b",
    "#f3fb6b",
    "#6d3935",
    "#243033",
    "#939260",
    "#2c4100",
    "#223e19",
    "#805f5b",
    "#498b5c",
    "#a4b7c4",
    "#5b4c9b",
    "#bdb27d",
    "#401b4c",
    "#56a781",
    "#b449b9",
    "#d7de65",
    "#210a01",
    "#8861dd",
    "#fbcca6",
    "#6b213f",
    "#8749d6",
    "#dc9cb5",
    "#95fe62",
    "#e1e0c7",
    "#c78cb7",
    "#002155",
    "#0d0828",
    "#467e3b",
    "#9b7ba1",
    "#877889",
    "#5f92f9",
    "#c7fe96",
    "#4b31b7",
    "#302317",
    "#8f712c",
    "#8f8b9f",
    "#a1b26f",
    "#de8ef0",
    "#19413d",
    "#ae7b30",
    "#a39778",
    "#f8edfa",
    "#66515d",
    "#642429",
    "#009d50",
    "#3f2c33",
    "#7d855a",
    "#c25703",
    "#f8c0fe",
    "#694578",
    "#fd2720",
    "#4a4e60",
    "#926e54",
    "#5c734d",
    "#7ea893",
    "#8ca2b6",
    "#a992f6",
    "#844851",
    "#cbc972",
    "#7e5e74",
    "#dbf8fe",
    "#2b2894",
    "#4f4736",
    "#098458",
    "#de6f67",
    "#302d45",
    "#feeaab",
    "#f38c50",
    "#2e1218",
    "#9c2365",
    "#563e5b",
    "#0c87cd",
    "#002d1c",
    "#b13759",
    "#f6a690",
    "#3a637c",
    "#996cc9",
    "#7550fb",
    "#6ce4d7",
    "#cb6cb3",
    "#004d3b",
    "#558472",
    "#dc9458",
    "#946d6b",
    "#926777",
    "#dc4acc",
    "#4b3632",
    "#b18666",
    "#c3a38a",
    "#ba77da",
    "#935c86",
    "#fec8d9",
    "#85af6a",
    "#67fefd",
    "#e0c08d",
    "#81897a",
    "#744c44",
    "#aab5e1",
    "#beb99c",
    "#d3bec0",
    "#fc970d",
    "#e6ceb1",
    "#8e8287",
    "#a8c9d4",
    "#880090",
    "#6e5d5e",
    "#3d8da7",
    "#62625c",
    "#83e2fd",
    "#e3ac43",
    "#a0998b",
    "#998836",
    "#8b3141",
    "#3a6e5c",
    "#e09dd6",
    "#021a14",
    "#515eb8",
    "#2c2d16",
    "#b5cd8f",
    "#696691",
    "#bf7739",
    "#b67459",
    "#db354c",
    "#191b1b",
    "#8ca4a1",
    "#a7524c",
    "#e15000",
    "#d4bd03",
    "#7592c5",
    "#650a01",
    "#ac4fdc",
    "#d6e3e6",
    "#6bda66",
    "#a14134",
    "#a296a2",
    "#58541b",
    "#a6ada0",
    "#eaccec",
    "#7a6148",
    "#201450",
    "#32182c",
    "#6d371b",
    "#9e1702",
    "#02e8b8",
    "#b3e3c0",
    "#5e7f2c",
    "#93aa49",
    "#b14d22",
    "#677075",
    "#dcdae1",
    "#02d2c9",
    "#786e6a",
    "#9d9f03",
    "#662d82",
    "#01ac9e",
    "#097821",
    "#f1740f",
    "#cde0fe",
    "#f3fed2",
    "#77761e",
    "#3f3e9a",
    "#0274a4",
    "#bdbbc9",
    "#6e5c05",
    "#bd6271",
    "#924ba0",
    "#263930",
    "#e8a17d",
    "#c38001",
    "#437879",
    "#79dbdf",
    "#fdba6e",
    "#e72800",
    "#fce1da",
    "#46355d",
    "#df7a8c",
    "#fd6cb0",
    "#1e021e",
    "#7c66a3",
    "#a24471",
    "#032adf",
    "#9d4d5f",
    "#7a7d66",
    "#7755b1",
    "#e2dbd2",
    "#0649ba",
    "#30a203",
    "#574b6f",
    "#7cb309",
    "#1c1c2c",
    "#ac8f99",
    "#5a35dd",
    "#091018",
    "#5c9a91",
    "#855341",
    "#af1732",
    "#6d9193",
    "#877941",
    "#75ecb0",
    "#958875",
    "#6c4f16",
    "#5c4737",
    "#fd109a",
    "#56481e",
    "#caa375",
    "#005f2a",
    "#d2e49e",
    "#415b43",
    "#036d66",
    "#e0f4eb"
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
    "commit_modularity": ["#990000",
      "#d7301f",
      "#ef6548",
      "#fc8d59",
      "#fdbb84",
      "#fdd49e",
      "#fee8c8",
      "#fff7ec"
    ],
    "most_edited_file": ["#ffffff",
      "#ece7f2",
      "#d0d1e6",
      "#a6bddb",
      "#74a9cf",
      "#3690c0",
      "#0570b0",
      "#034e7b"
    ],
    "pom_files": ["#ffffff",
      "#fcbba1",
      "#fc9272",
      "#fb6a4a",
      "#ef3b2c",
      "#cb181d",
      "#a50f15",
      "#67000d"
    ],
    "commit_age": ["#f7fcf0", // TODO change the color scheme
      "#e0f3db",
      "#ccebc5",
      "#a8ddb5",
      "#7bccc4",
      "#4eb3d3",
      "#2b8cbe",
      "#08589e"
    ],
  };
  this.chunkNum = 8;

  var outer = this;

  var EqualRangeMapper = function (maxValue, metricName, exp, separateZero) {

    this._mappingInfo = null;
    exp = exp ? exp : 0;
    separateZero = Boolean(separateZero);

    this.map = function (value) {
      var mappingInfos = this.getMappingInfo();
      for (var i = 0; i < mappingInfos.length; i++) {
        if (value <= mappingInfos[i].upperBound) {
          return mappingInfos[i].color;
        }
      }
      return mappingInfos[mappingInfos.length - 1].color;
    };

    this.getMappingInfo = function () {
      if (this._mappingInfo) {
        return this._mappingInfo;
      }

      var mappingInfo = [];
      var step, boundary, i;
      if (!separateZero) {
        step = maxValue / outer.chunkNum;
        boundary = 0;
        i = 0;
      } else {
        mappingInfo.push({
          lowerBound: 0,
          upperBound: 0,
          color: outer.metric2color[metricName][0]
        });

        step = (maxValue - 1) / (outer.chunkNum - 1);
        boundary = 1;
        i = 1;
      }


      for (i; i < outer.chunkNum; i++) {
        mappingInfo.push({
          lowerBound: Math.ceil10(boundary, exp),
          upperBound: Math.specialBoundFloor10(boundary + step, exp, maxValue),
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

      mappingInfo.map(function (mi) {
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

  var FibonacciRangeMapper = function (maxValue, metricName) {

    this._mappingInfo = null;

    this.map = function (value) {
      var mappingInfos = this.getMappingInfo();
      for (var i = 0; i < mappingInfos.length; i++) {
        if (value <= mappingInfos[i].upperBound) {
          return mappingInfos[i].color;
        }
      }
      return mappingInfos[mappingInfos.length - 1].color;
    };

    this.getMappingInfo = function () {
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
          lowerBound: Math.fibo(i + 1) + 1,
          upperBound: Math.fibo(i + 2),
          color: outer.metric2color[mName][i]
        });
      }

      mappingInfo.push({
        lowerBound: Math.fibo(outer.chunkNum) + 1,
        upperBound: Number.MAX_VALUE,
        color: outer.metric2color[mName][outer.chunkNum - 1]
      });

      mappingInfo.map(function (val) {
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

  var TimesRangeMapper = function (maxValue, metricName) {
    this._mappingInfo = null;

    this.map = function (value) {
      var mappingInfos = this.getMappingInfo();
      for (var i = 0; i < mappingInfos.length; i++) {
        if (value <= mappingInfos[i].upperBound) {
          return mappingInfos[i].color;
        }
      }
      return mappingInfos[mappingInfos.length - 1].color;
    };

    this.getMappingInfo = function () {
      if (this._mappingInfo) {
        return this._mappingInfo;
      }

      var mName = metricName;
      var mappingInfo = [];

      mappingInfo.push({
        lowerBound: 0,
        upperBound: 59,
        legendText: "Less than 1 minute"
      });

      mappingInfo.push({
        lowerBound: 60,
        upperBound: 3599,
        legendText: "1–59 minutes"
      });

      mappingInfo.push({
        lowerBound: 3600,
        upperBound: 7199,
        legendText: "1–2 hours"
      });

      mappingInfo.push({
        lowerBound: 7200,
        upperBound: 43199,
        legendText: "2–12 hours"
      });

      mappingInfo.push({
        lowerBound: 43200,
        upperBound: 86399,
        legendText: "12–24 hours"
      });

      mappingInfo.push({
        lowerBound: 86400,
        upperBound: 172799,
        legendText: "1–2 days"
      });

      mappingInfo.push({
        lowerBound: 172800,
        upperBound: 604799,
        legendText: "2–7 days"
      });

      mappingInfo.push({
        lowerBound: 604800,
        upperBound: Number.MAX_VALUE,
        legendText: "More than 7 days"
      });

      var i = 0;
      mappingInfo.map(function (val) {
        val.color = outer.metric2color[mName][i++];
      });

      this._mappingInfo = mappingInfo;
      return mappingInfo;
    };
  }

  var BranchUsageMapper = function () {
    this.map = function (value) {
      return outer.branch_use_colors[value - 1]; // values start with 1, arrays with 0
    };
  };

  var CommitAuthorMapper = function () {
    this.map = function (value) {
      return outer.commit_author[value];
    };
  };

  this.createMapper = function (maxValue, metricName) {
    switch (metricName) {
      case "branch_usage":
        return new BranchUsageMapper();
      case "commit_author":
        return new CommitAuthorMapper();
      case "commit_message_length":
        return new FibonacciRangeMapper(maxValue, metricName);
      case "commit_age":
        return new TimesRangeMapper(maxValue, metricName);
      case "most_edited_file":
      case "pom_files":
        return new EqualRangeMapper(maxValue, metricName, 0, true);
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
  for (var i = 0; i < arr.length; i++) {
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
  Math.round10 = function (value, exp) {
    return decimalAdjust('round', value, exp);
  };
}
// Decimal floor
if (!Math.floor10) {
  Math.floor10 = function (value, exp) {
    return decimalAdjust('floor', value, exp);
  };
}
// Decimal ceil
if (!Math.ceil10) {
  Math.ceil10 = function (value, exp) {
    return decimalAdjust('ceil', value, exp);
  };
}

// A special purpose bound floor. This function returns a non-inclusive floor (0.1-->0, 0.5-->0, 0.9-->0, 1-->0,
// 1.1-->0), unless the number is the maximum, in which case it returns that maximum.
Math.specialBoundFloor10 = function (value, exp, maxVal) {
  var result = decimalAdjust('floor', value, exp);
  if (result == value && result != maxVal) {
    return value - Math.pow(10, exp);
  } else {
    return result;
  }
};

Math.fibo = function (n) {
  if (n < 2) return 1;
  return Math.fibo(n - 2) + Math.fibo(n - 1);
};

var repogramsModule = angular.module('repogramsModule', [
  'repogramsDirectives',
  'repogramsControllers',
  'repogramsServices',
  'ui.bootstrap',
  'ngAnimate',
  'ngSanitize',
  'angular-loading-bar',
  'vr.directives.slider']);
