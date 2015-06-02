Mappers['times_range'] = {
    mappingInfo: [
      {
        lowerBound: 0,
        upperBound: 59,
        legendText: "Less than 1 minute"
      },
      {
        lowerBound: 60,
        upperBound: 3599,
        legendText: "1–59 minutes"
      },
      {
        lowerBound: 3600,
        upperBound: 7199,
        legendText: "1–2 hours"
      },
      {
        lowerBound: 7200,
        upperBound: 43199,
        legendText: "2–12 hours"
      },
      {
        lowerBound: 43200,
        upperBound: 86399,
        legendText: "12–24 hours"
      },
      {
        lowerBound: 86400,
        upperBound: 172799,
        legendText: "1–2 days"
      },
      {
        lowerBound: 172800,
        upperBound: 604799,
        legendText: "2–7 days"
      },
      {
        lowerBound: 604800,
        upperBound: Number.MAX_VALUE,
        legendText: "More than 7 days"
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
    updateMappingInfo: function (newMaxValue) {
      return false;
    }
};
