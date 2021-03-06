/* global _ */
// @ngInject
function HomeCtrl(
  $q, $scope, $uibModal,
  localStorageService,
  Gems, ImgUrls, Items, Runes, RuneRecipes, RuneWordFilter, RuneWords
) {
  "use strict";

  var viewModel = this;

  viewModel.resourcesLoaded = false;
  viewModel.includeLadderOnly = true;
  viewModel.selectedItemType = RuneWordFilter.getItemTypeDefaultLabel();
  viewModel.itemTypes = [viewModel.selectedItemType];
  viewModel.selectedRune = RuneWordFilter.getRuneDefaultLabel();
  viewModel.runeNames = [viewModel.selectedRune];
  viewModel.selectedRunesNeeded = RuneWordFilter.getRunesNeededDefaultLabel();
  viewModel.runesNeededAmts = [viewModel.selectedRunesNeeded];
  viewModel.runesOwned = {};

  viewModel.itemImgUrl = function(itemName) {
    return ImgUrls.getImgUrl(itemName);
  };

  function addItemImageUrls(itemCollection, itemKey) {
    itemCollection.forEach(function(item) {
      ImgUrls.addImgUrl(item[itemKey], item.img_url);
    });
  }

  function initializeLocalStorage() {
    viewModel.runes.forEach(function(rune) {
      if (localStorageService.isSupported) {
        localStorageService.bind($scope, 'mainVm.runesOwned.'+[rune.name], 0, rune.name);
      } else {
        viewModel.runesOwned[rune.name] = 0;
      }
    });
  }

  viewModel.filterRuneWordTable = function(runeWord) {
    return RuneWordFilter.filterByLadderAllowed(
      runeWord, viewModel.includeLadderOnly
    ) && RuneWordFilter.filterByItemType(
      runeWord, viewModel.selectedItemType
    ) && RuneWordFilter.filterByRune(
      runeWord, viewModel.selectedRune
    ) && RuneWordFilter.filterBySearchText(
      runeWord, viewModel.runeWordNameSearchText
    ) && RuneWordFilter.filterByRunesNeeded(
      runeWord, viewModel.countRunesOwned(runeWord.rune_order), viewModel.selectedRunesNeeded
    );
  };

  viewModel.countRunesOwned = function(runeList) {
    var runeListAmts = {};
    runeList.forEach(function(rune) {
      runeListAmts[rune] = viewModel.runesOwned[rune];
    });

    var runesOwned = 0;
    runeList.forEach(function(rune) {
      if (runeListAmts[rune] > 0) {
        runesOwned += 1;
        runeListAmts[rune] -=1;
      }
    });

    return runesOwned;
  };

  viewModel.runeConditionMet = function(rune, runeWordRuneOrder, runeWordIndex) {
    var numRunesAvailable = viewModel.runesOwned[rune];
    for (var i = 0; i < runeWordIndex; ++i) {
      if (runeWordRuneOrder[i] === rune) {
        numRunesAvailable--;
      }
    }

    return numRunesAvailable > 0;
  };

  viewModel.openItemsModal = function(itemType, sockets) {
    $uibModal.open({
      templateUrl: 'items_modal.html',
      controller: 'ItemsModalCtrl',
      windowClass: 'itemsModal',
      resolve: {
        itemType: function () {
          return itemType;
        },
        sockets: function () {
          return sockets;
        },
        itemsList: function() {
          return viewModel.items;
        }
      }
    });
  };

  var promises = [
    Runes.index().$promise.then(function(runeData) {
      addItemImageUrls(runeData, "name");
      viewModel.runes = runeData;

      viewModel.runeNames = viewModel.runeNames.concat(
        runeData.map(function(rune) {
          return rune.name;
        })
      );

      initializeLocalStorage();
    }),

    Gems.index().$promise.then(function(gemData) {
      addItemImageUrls(gemData, "gem");
      viewModel.gems = gemData;
    }),

    Items.get().$promise.then(function(itemData) {
      viewModel.items = itemData;
      viewModel.itemTypes = viewModel.itemTypes.concat(
        Object.keys(itemData.toJSON()).sort()
      );
    }),

    RuneWords.index().$promise.then(function(runeWordData) {
      viewModel.runeWords = runeWordData;
      var maxRunesNeeded = _.max(
        _.map(runeWordData, function(runeWord) {
          return runeWord.rune_order.length;
        })
      );
      for (var i = 0; i <= maxRunesNeeded; ++i) {
        viewModel.runesNeededAmts.push(i);
      }
    }),

    RuneRecipes.get().$promise.then(function(runeRecipeData) {
      viewModel.runeRecipes = runeRecipeData;
    })
  ];

  $q.all(promises).then(function() {
    viewModel.resourcesLoaded = true;
  });
}

angular.module('runemaster').controller('HomeCtrl', HomeCtrl);
