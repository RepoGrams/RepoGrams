Metrics['METRIC_ID'] = {
  'label': "HUMAN READABLE NAME",
  'icon': 'FONT-AWESOME-ICON_ID',
  'description': "DESCRIPTION",
  'long_description': "SUB DESCRIPTION OR NULL",
  colors: [
    "#000000",
    "#222222",
    "#444444",
    "#666666",
    "#888888",
    "#AAAAAA",
    "#CCCCCC",
    "#EEEEEE"
  ],
  mapper: Mappers['SOME_MAPPER_OR_FUNCTION_THAT_RETURNS_A_MAPPER'],
  tooltip: function(value) {
    return "SOME_TEXT_ABOUT_THE_VALUE_" + value;
  }
};
