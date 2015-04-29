Mappers['discrete_bucket'] = {
  map: function (value, colors) {
    return colors[value % colors.length];
  },
  updateMappingInfo: function (allValues) {
    return false;
  }
};
