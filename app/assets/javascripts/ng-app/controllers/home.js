// @ngInject
function HomeCtrl($scope, Runes) {
  var viewModel = this;
  viewModel.runes = Runes.index();
}

angular.module('runemaster').controller('HomeCtrl', HomeCtrl);
