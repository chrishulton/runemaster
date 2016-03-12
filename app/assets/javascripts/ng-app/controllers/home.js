// @ngInject
function HomeCtrl($scope, Gems, Runes, RuneRecipes) {
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
}

angular.module('runemaster').controller('HomeCtrl', HomeCtrl);
