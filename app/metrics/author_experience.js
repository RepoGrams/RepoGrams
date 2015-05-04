Metrics['author_experience'] = {
  label: "Author Experience",
  icon: 'fa fa-user-times',
  description: "The number of commits a contributor has previously made to the repository",
  long_description: null,
  colors: [
    '#ffffe5',
    '#f7fcb9',
    '#d9f0a3',
    '#addd8e',
    '#78c679',
    '#41ab5d',
    '#238443',
    '#005a32'
  ],
  mapper: Mappers['equal_range'](1, 0, true),
  tooltip: function (value) {
    switch (value % 100) {
      case 11:
      case 12:
      case 13:
        return value + "th commit by author";
    }
    switch (value % 10) {
      case 1:
        return value + "st commit by author";

      case 2:
        return value + "nd commit by author";

      case 3:
        return value + "rd commit by author";

      default:
        return value + "th commit by author";
    }
  }
};
