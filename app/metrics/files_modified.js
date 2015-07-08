Metrics['files_modified'] = {
  label: "Files Modified",
  icon: 'fa fa-file',
  description: "The number of files modified in a particular commit, includes new and deleted files.",
  long_description: null,
  colors: [
    '#f7f4f9',
    '#e7e1ef',
    '#d4b9da',
    '#c994c7',
    '#df65b0',
    '#e7298a',
    '#ce1256',
    '#91003f'
  ],
  mapper: Mappers['fibonacci_range'](),
  tooltip: function (value) {
    switch (value) {
      case 0:
        return "No files were modified";

      case 1:
        return "1 file was modified";

      default:
        return value + " files were modified";
    }
  }
};
