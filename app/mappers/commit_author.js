Mappers['commit_author'] = {
  mappingInfo: {},
  map: function (author, colors) {
    return colors[author.id % colors.length];
  },
  updateMappingInfo: function (allValues) {
    return false;
  }
};
