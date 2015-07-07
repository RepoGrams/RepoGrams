Metrics['most_edited_file'] = {
  label: "Most Edited File",
  icon: 'fa fa-dot-circle-o',
  description: "The number of times that the most edited file in a commit has been previously modified.",
  long_description: null,
  colors: [
    '#ffffff',
    '#ece7f2',
    '#d0d1e6',
    '#a6bddb',
    '#74a9cf',
    '#3690c0',
    '#0570b0',
    '#034e7b'
  ],
  mapper: Mappers['equal_range'](0, 0, true),
  tooltip: function (value) {
    switch (value) {
      case 0:
        return "Edited for the first time";

      case 1:
        return "Edited once before";

      default:
        return "Edited " + value + " times before";
    }
  }
};
