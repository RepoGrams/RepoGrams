Metrics['commit_message_length'] = {
  label: "Commit Message Length",
  icon: 'fa fa-circle',
  description: "The number of words in a commit log message.",
  long_description: null,
  colors: [
    '#f7fcf0',
    '#e0f3db',
    '#ccebc5',
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#08589e'
  ],
  mapper: Mappers['fibonacci_range']("lowerDescript", "upperDescript"),
  tooltip: function (value) {
    return (value == 1) ? "1 word" : value + " words";
  }
};
