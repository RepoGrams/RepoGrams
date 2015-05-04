Metrics['languages_in_a_commit'] = {
  label: "Languages in a Commit",
  icon: 'fa fa-certificate',
  description: "The number of unique programming languages used in a commit based on filenames.",
  long_description: null,
  colors: [
    '#f7fcfd',
    '#e0ecf4',
    '#bfd3e6',
    '#9ebcda',
    '#8c96c6',
    '#8c6bb1',
    '#88419d',
    '#6e016b'
  ],
  mapper: Mappers['equal_range'](0, 0, true),
  tooltip: function (value) {
    return (value == 1) ? "1 language" : value + " languages";
  }
};
