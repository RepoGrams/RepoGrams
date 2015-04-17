Mappers['fibonacci_range'] = {
  mappingInfo: [
    {
      lowerBound: 0,
      upperBound: 1,
      legendText: "0–1"
    },
    {
      lowerBound: 2,
      upperBound: 3,
      legendText: "2–3"
    },
    {
      lowerBound: 4,
      upperBound: 5,
      legendText: "4–5"
    },
    {
      lowerBound: 6,
      upperBound: 8,
      legendText: "6–8"
    },
    {
      lowerBound: 9,
      upperBound: 13,
      legendText: "9–13"
    },
    {
      lowerBound: 14,
      upperBound: 21,
      legendText: "14–21"
    },
    {
      lowerBound: 22,
      upperBound: 34,
      legendText: "22–34"
    },
    {
      lowerBound: 35,
      upperBound: Number.MAX_VALUE,
      legendText: "35+"
    }
  ],
  map: function (value, colors) {
    for (var i = 0; i < this.mappingInfo.length; i++) {
      if (value <= this.mappingInfo[i].upperBound) {
        return colors[i];
      }
    }
    return colors[colors.length - 1];
  },
  updateMappingInfo: function (allValues) {
    return false;
  }
};
