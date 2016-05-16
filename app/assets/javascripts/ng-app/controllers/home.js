// @ngInject
function HomeCtrl($scope, $uibModal, localStorageService, Gems, ImgUrls, Items, Runes, RuneRecipes, RuneWords) {
  var viewModel = this;
  viewModel.itemImgUrl = function(itemName) {
    return ImgUrls.getImgUrl(itemName);
  };
  viewModel.runesOwned = {};

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

  viewModel.runeConditionMet = function(rune, runeWordRuneOrder, runeWordIndex) {
    var numRunesAvailable = viewModel.runesOwned[rune];
    for (var i = 0; i < runeWordIndex; ++i) {
      if (runeWordRuneOrder[i] === rune) {
        numRunesAvailable--;
      };
    };

    return numRunesAvailable > 0;
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
