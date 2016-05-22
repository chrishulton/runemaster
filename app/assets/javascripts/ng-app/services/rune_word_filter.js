// @ngInject
function RuneWordFilter() {
  "use strict";

  return {
    filterByItemType: function(runeWord, itemType) {
      if (itemType && itemType !== "All") {
        return _.includes(
          _.map(runeWord.allowed_items, "type"),
          itemType
        );
      } else {
        return true;
      }
    },

    filterByLadderAllowed: function(runeWord, ladderAllowed) {
      if (ladderAllowed) {
        return true
      } else {
        return !runeWord.ladder_only;
      }
    },

    filterBySearchText: function(runeWord, searchText) {
      if (searchText) {
        var regEx = new RegExp(searchText, 'i');
        return runeWord.name.match(regEx);
      } else {
        return true;
      }
    }
  };
}

angular.module('runemaster').factory('RuneWordFilter', RuneWordFilter);
