/* global _ */
// @ngInject
function RuneWordFilter() {
  "use strict";

  var ITEM_TYPE_DEFAULT_LABEL = "All";
  var RUNES_NEEDED_DEFAULT_LABEL = "Any";

  return {
    getItemTypeDefaultLabel: function() {
      return ITEM_TYPE_DEFAULT_LABEL;
    },

    getRunesNeededDefaultLabel: function() {
      return RUNES_NEEDED_DEFAULT_LABEL;
    },

    filterByItemType: function(runeWord, itemType) {
      if (itemType !== ITEM_TYPE_DEFAULT_LABEL) {
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
        return true;
      } else {
        return !runeWord.ladder_only;
      }
    },

    filterBySearchText: function(runeWord, searchText) {
      if (searchText) {
        var regEx = new RegExp(searchText, 'i');
        return !!runeWord.name.match(regEx);
      } else {
        return true;
      }
    },

    filterByRunesNeeded: function(runeWord, runeWordRunesOwned, runesNeeded) {
      if (runesNeeded !== RUNES_NEEDED_DEFAULT_LABEL) {
        var runeWordRunesTotal = runeWord.rune_order.length;
        var runeWordRunesNeeded = runeWordRunesTotal - runeWordRunesOwned;
        return runeWordRunesNeeded === runesNeeded;
      } else {
        return true;
      }
    }
  };
}

angular.module('runemaster').factory('RuneWordFilter', RuneWordFilter);
