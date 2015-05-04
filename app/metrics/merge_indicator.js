Metrics['merge_indicator'] = {
  label: "Merge Indicator",
  icon: 'fa fa-code-fork',
  description: "Displays the number of parents involved in a commit",
  long_description: "2 or more parents denote a merge commit.",
  colors: [
    '#fff7f3',
    '#fde0dd',
    '#fcc5c0',
    '#fa9fb5',
    '#f768a1',
    '#dd3497',
    '#ae017e',
    '#7a0177'
  ],
  mapper: Mappers['equal_range'](0, 0, true),
  tooltip: function (value) {
    switch (value) {
      case 0:
        return "Commit has no parents";

      case 1:
        return "Commit has 1 parent";

      default:
        return "Commit has " + value + " parents";
    }
  }
};
