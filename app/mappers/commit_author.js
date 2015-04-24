Mappers['commit_author'] = {
  mappingInfo: {},
  map: function (author, colors) {
    return colors[this.mappingInfo[author.name] % colors.length];
  },
  updateMappingInfo: function (allValues) {
    var that = this;
    this.mappingInfo = {};

    // Build a list of set-pairs that contain all matching author names and/or emails
    var pairsOfAuthorDataSets = [];
    allValues.forEach(function (author) {
      var indexOfMatchingName = -1, indexOfMatchingEmail = -1;

      // Look for the author's name and/or email in existing set-pairs
      for (var i = 0; i < pairsOfAuthorDataSets.length; i++) {
        if (pairsOfAuthorDataSets[i].names.has(author.name)) {
          indexOfMatchingName = i;
        }
        if (pairsOfAuthorDataSets[i].emails.has(author.email)) {
          indexOfMatchingEmail = i;
        }
      }

      if (indexOfMatchingName == -1 && indexOfMatchingEmail == -1) {
        // New name and email - create a new set-pair
        pairsOfAuthorDataSets.push({
          names: new Set([author.name]),
          emails: new Set([author.email])
        });
      } else if (indexOfMatchingName >= 0 && indexOfMatchingEmail == -1) {
        // An existing name with a new email - add the email to the relevant set-pair
        pairsOfAuthorDataSets[indexOfMatchingName].emails.add(author.email);
      } else if (indexOfMatchingName == -1 && indexOfMatchingEmail >= 0) {
        // An existing email with a new name - add the name to the relevant set-pair
        pairsOfAuthorDataSets[indexOfMatchingEmail].names.add(author.name);
      } else if (indexOfMatchingName != indexOfMatchingEmail) {
        // An existing email and an existing name that were found in different set-pairs - merge the two set-pairs
        var highIndex = Math.max(indexOfMatchingName, indexOfMatchingEmail);
        var lowIndex = Math.min(indexOfMatchingName, indexOfMatchingEmail);
        var mergeFromSetPair = pairsOfAuthorDataSets.splice(highIndex, 1)[0];
        var mergeToSetPair = pairsOfAuthorDataSets[lowIndex];
        mergeFromSetPair.names.forEach(function (name) {
          mergeToSetPair.names.add(name);
        });
        mergeFromSetPair.emails.forEach(function (email) {
          mergeToSetPair.emails.add(email);
        });
      } else {
        // The only remaining option is that both the name and the email address were found, but are already in the same
        // pair. Do nothing.
      }
    });

    // Build a map from author name to color. Since name/email pairs have all been merged when identifying the same
    // person, we can index solely on the author name.
    allValues.forEach(function (author) {
      if (!(author.name in that.mappingInfo)) {
        for (var i = 0; i < pairsOfAuthorDataSets.length; i++) {
          if (pairsOfAuthorDataSets[i].names.has(author.name)) {
            that.mappingInfo[author.name] = i;
            break;
          }
        }
      }
    });

    return true;
  }
};
