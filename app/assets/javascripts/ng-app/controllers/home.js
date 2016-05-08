// @ngInject
function HomeCtrl($scope, $uibModal, localStorageService, Gems, Items, Runes, RuneRecipes, RuneWords) {
  var viewModel = this;
  viewModel.itemImgUrl = function(itemName) {
    return itemsToImageUrls[itemName];
  };
  viewModel.runesOwned = {};

  var itemsToImageUrls = {};
  function addItemImageUrls(itemCollection, itemKey) {
    itemCollection.forEach(function(item) {
      itemsToImageUrls[item[itemKey]] = item.img_url;
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

  Runes.index().$promise.then(function(data) {
    addItemImageUrls(data, "name");
    viewModel.runes = data;

    initializeLocalStorage();
  });
  Gems.index().$promise.then(function(data) {
    addItemImageUrls(data, "gem");
    viewModel.gems = data;
  });
  viewModel.runeRecipes = RuneRecipes.get();
  viewModel.runeWords = RuneWords.index();

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
      };
    });

    return runesOwned;
  };

  viewModel.openItemsModal = function(itemType, sockets) {
    var modalInstance = $uibModal.open({
      templateUrl: 'items_modal.html',
      controller: 'ItemsModalCtrl',
      windowClass: 'itemsModal',
      resolve: {
        itemType: function () {
          return itemType;
        },
        sockets: function () {
          return sockets;
        }
      }
    });
  };
}

angular.module('runemaster').controller('HomeCtrl', HomeCtrl);
