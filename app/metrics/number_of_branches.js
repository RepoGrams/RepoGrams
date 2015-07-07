Metrics['number_of_branches'] = {
  label: "Number of Branches",
  icon: 'fa fa-cog',
  description: "The number of branches that are concurrently active at a commit point.",
  long_description: null,
  colors: [
    '#f7fcfd',
    '#e5f5f9',
    '#ccece6',
    '#99d8c9',
    '#66c2a4',
    '#41ae76',
    '#238b45',
    '#005824'
  ],
  mapper: Mappers['equal_range'](1, 0, false),
  tooltip: function (value) {
    return (value == 1) ? "1 concurrent branch" : value + " concurrent branches";
  }
};
