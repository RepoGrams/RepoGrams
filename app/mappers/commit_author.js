Mappers['commit_author'] = {
  mappingInfo: {},
  map: function (author, colors) {
    return colors[this.mappingInfo[author.name] % colors.length];
  },
  updateMappingInfo: function (allValues) {
    var that = this;
    this.mappingInfo = {};
    var i = 0;
    allValues.forEach(function (author) {
      if (!(author.name in that.mappingInfo)) {
        that.mappingInfo[author.name] = i++;
      }
    });
    return true;
  }
};
