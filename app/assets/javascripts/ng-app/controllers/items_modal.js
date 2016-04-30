// @ngInject
function ItemsModalCtrl($scope, Items, itemType, sockets) {
  $scope.itemType = itemType;
  $scope.sockets = sockets;
  $scope.qualitySelected = "elite";
  $scope.itemTypeMissing = false;

  $scope.selectQuality = function(quality) {
    $scope.items = $scope.itemData[quality];
    $scope.qualitySelected = quality;
  };

  $scope.socketsFilter = function(item) {
    return item.sockets >= $scope.sockets;
  }

  Items.get().$promise.then(function(data) {
    if (data[itemType]) {
      $scope.itemData = data[itemType];
      $scope.selectQuality("elite");
    } else {
      $scope.itemTypeMissing = true;
    }
  });
}

angular.module('runemaster').controller('ItemsModalCtrl', ItemsModalCtrl);
