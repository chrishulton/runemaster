// @ngInject
function HomeCtrl($scope, $uibModal, Gems, Items, Runes, RuneRecipes, RuneWords) {
  var viewModel = this;
  var itemsToImageUrls = {};
  var addItemImageUrls = function(itemCollection, itemKey) {
    itemCollection.forEach(function(item) {
      itemsToImageUrls[item[itemKey]] = item.img_url;
    });
  };
  viewModel.itemImgUrl = function(itemName) {
    return itemsToImageUrls[itemName];
  };

  Runes.index().$promise.then(function(data) {
    addItemImageUrls(data, "name");
    viewModel.runes = data;
  });
  Gems.index().$promise.then(function(data) {
    addItemImageUrls(data, "gem");
    viewModel.gems = data;
  });
  viewModel.runeRecipes = RuneRecipes.index();
  viewModel.runeWords = RuneWords.index();

  viewModel.openItemsModal = function(itemType, sockets) {
    var modalInstance = $uibModal.open({
      templateUrl: 'items_modal.html',
      controller: 'ItemsModalCtrl',
      windowClass: 'runesModal',
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
