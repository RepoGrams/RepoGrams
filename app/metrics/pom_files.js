Metrics['pom_files'] = {
  label: "POM files",
  icon: 'fa fa-codepen',
  description: "The number of POM files changed in every commit.",
  long_description: null,
  colors: [
    '#ffffff',
    '#fcbba1',
    '#fc9272',
    '#fb6a4a',
    '#ef3b2c',
    '#cb181d',
    '#a50f15',
    '#67000d'
  ],
  mapper: Mappers['equal_range'](0, 0, true, "lowerDescript", "upperDescript"),
  tooltip: function (value) {
    return value + " POM " + ((value == 1) ? "file" : "files") + " changed";
  }
};
