Mappers['equal_range'] = function (minValue, exponent, separateFirstBucket, lowerDescription, upperDescription) {
  return {
    _currentMaxValue: -1,
    mappingInfo: [],
    map: function (value, colors) {
      for (var i = 0; i < this.mappingInfo.length; i++) {
        if (value <= this.mappingInfo[i].upperBound) {
          return colors[i];
        }
      }
      return colors[colors.length - 1];
    },
    updateMappingInfo: function (allValues) {
      var newMaxValue = arrayMax(allValues);
      if (this._currentMaxValue >= newMaxValue) {
        return false;
      } else {
        this._currentMaxValue = newMaxValue;
      }

      // TODO do something with minValue
      this.mappingInfo = [];
      var chunkNum = 8;

      var step, boundary, i;
      if (separateFirstBucket) {
        this.mappingInfo.push({
          lowerBound: 0,
          upperBound: 0
        });

        step = (newMaxValue - 1) / (chunkNum - 1);
        boundary = 1;
        i = 1;
      } else {
        step = newMaxValue / chunkNum;
        boundary = 0;
        i = 0;
      }


      for (i; i < chunkNum - 1; i++) {
        this.mappingInfo.push({
          lowerBound: Math.ceil10(boundary, exponent),
          upperBound: Math.specialBoundFloor10(boundary + step, exponent, newMaxValue)
        });
        boundary += step;
      }
      this.mappingInfo.push({
        lowerBound: Math.ceil10(boundary, exponent),
        upperBound: newMaxValue
      });

      this.mappingInfo = this.mappingInfo.filter(function (mi) {
        return mi.lowerBound <= mi.upperBound;
      });

      var previousLowerBound = Number.MIN_VALUE;
      this.mappingInfo = this.mappingInfo.filter(function (mi) {
        if (mi.lowerBound == previousLowerBound) {
          return false;
        }
        previousLowerBound = mi.lowerBound;
        return true;
      });

      this.mappingInfo.map(function (mi) {
        if (mi.lowerBound == mi.upperBound) {
          mi.legendText = mi.lowerBound.toFixed(-exponent);
        }
        else {
          mi.legendText = mi.lowerBound.toFixed(-exponent) + '–' + mi.upperBound.toFixed(-exponent);
        }
      });

      if (lowerDescription && this.mappingInfo.length > 0) {
        this.mappingInfo[0].legendText += " (" + lowerDescription + ")";
      }
      if (upperDescription && this.mappingInfo.length > 1) {
        this.mappingInfo[this.mappingInfo.length - 1].legendText += " (" + upperDescription + ")";
      }

      return true;
    }
  }
};
