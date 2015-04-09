Mappers['MAPPER_NAME'] = {
  mappingInfo: [], // TODO or the full mapper, such as in times_range
  map: function (value, colors) {
    // TODO a function that, given a value and an array of colors, maps the value to a color using the pre-computed mappingInfo
    return colors[0];
  },
  updateMappingInfo: function (newMaxValue) {
    // TODO update the mappingInfo when maxValue changes. Return true if the mappingInfo was changed, false otherwise.
    return false;
  }
};
