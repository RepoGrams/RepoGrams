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
    if (value == 1) {
      return "1 second";
    }
    if (value < 60) {
      return Math.floor(value) + " seconds";
    }
    if (value < 120) {
      return "1 minute";
    }
    if (value < 3600) {
      return Math.floor(value / 60) + " minutes";
    }
    if (value < 7200) {
      return "1 hour";
    }
    if (value < 86400) {
      return Math.floor(value / 3600) + " hours";
    }
    if (value < 172800) {
      return "1 day"
    }
    if (value < 604800) {
      return Math.floor(value / 86400) + " days";
    }
    if (value < 1209600) {
      return "1 week";
    }
    return Math.floor(value / 604800) + " weeks";
  }
};
