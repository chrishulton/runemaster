// @ngInject
function ItemsModalCtrl($scope, itemType, sockets, itemsList) {
  $scope.itemType = itemType;
  $scope.sockets = sockets;
  $scope.itemsList = itemsList;
  $scope.qualitySelected = "elite";
  $scope.itemTypeMissing = false;

  $scope.selectQuality = function(quality) {
    $scope.items = $scope.itemData[quality];
    $scope.qualitySelected = quality;
  };

  $scope.socketsFilter = function(item) {
    return item.sockets >= $scope.sockets;
  }

  if ($scope.itemsList[itemType]) {
    $scope.itemData = $scope.itemsList[itemType];
    $scope.selectQuality("elite");
  } else {
    $scope.itemTypeMissing = true;
  }
}

angular.module('runemaster').controller('ItemsModalCtrl', ItemsModalCtrl);
