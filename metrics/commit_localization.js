Metrics['commit_localization'] = {
  label: "Commit Localization",
  icon: "sun-o",
  description: "Fraction of the number of unique project directories containing files modified by the commit.",
  long_description: "Metric value of 1 means that all the modified files in a commit are in a single directory. Metric value of 0 means <em>all</em> the project directories contain a file modified by the commit.",
  colors: [
    "#990000",
      "#d7301f",
      "#ef6548",
      "#fc8d59",
      "#fdbb84",
      "#fdd49e",
      "#fee8c8",
      "#fff7ec"
  ],
  mapper: Mappers['equal_range'](0, -2, false),
  tooltip: function (value) {
    return Math.round(value * 100) + "% localized files in the commit";
  }
};
