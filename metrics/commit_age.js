Metrics['commit_age'] = {
  'label': "Commit Age",
  'icon': 'clock-o',
  'description': "Elapsed time between a commit and its parent commit.",
  'long_description': "For merge commits we consider the elapsed time between a commit and its youngest parent commit.",
  colors: [
    "#fff7fb",
    "#ece2f0",
    "#d0d1e6",
    "#a6bddb",
    "#67a9cf",
    "#3690c0",
    "#02818a",
    "#016450"
  ],
  mapper: Mappers['times_range'],
  tooltip: function(value) {
    return value + " seconds"; // TODO changed to smart time
  }
};
