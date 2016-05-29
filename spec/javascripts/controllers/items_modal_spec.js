/* global expect */
/* global inject */
/* global spyOn */
"use strict";

describe('ItemsModalCtrl', function() {
  var $controller, $scope;
  var itemsModalCtrl;

  var fakeItemType = 'Armor';
  var fakeSockets = 2;
  var fakeNormalArmorTwoSocket = { name: 'TwoSocketN', sockets: 1 };
  var fakeEliteArmorOneSocket = { name: 'OneSocketE', sockets: 1 };
  var fakeEliteArmorTwoSocket = { name: 'TwoSocketE', sockets: 2 };
  var fakeEliteArmorThreeSocket = { name: 'ThreeSocketE', sockets: 3 };

  var fakeItemsList = {
    'Armor': {
      'elite': [fakeEliteArmorOneSocket, fakeEliteArmorTwoSocket, fakeEliteArmorThreeSocket],
      'normal': [fakeNormalArmorTwoSocket]
    }
  };

  beforeEach(function() {
    module("runemaster");

    inject(function(_$controller_, $rootScope) {
      $scope = $rootScope.$new();
      $controller = _$controller_;
    });
  });

  describe('when the item exists', function() {
    beforeEach(function() {
      itemsModalCtrl = $controller('ItemsModalCtrl', {
        $scope: $scope,
        itemType: fakeItemType,
        sockets: fakeSockets,
        itemsList: fakeItemsList
      });
    });

    describe('initialization', function() {
      it('selects the elite items', function() {
        expect($scope.itemTypeMissing).toEqual(false);
        expect($scope.qualitySelected).toEqual('elite');
        expect($scope.itemTypeData).toEqual(fakeItemsList.Armor);
        expect($scope.items).toEqual(fakeItemsList.Armor.elite);
      });
    });

    describe('#setQuality', function() {
      it('selects the items of matching quality', function() {
        $scope.selectQuality('normal');

        expect($scope.qualitySelected).toEqual('normal');
        expect($scope.items).toEqual(fakeItemsList.Armor.normal);
      });
    });

    describe('#socketsFilter', function() {
      it('returns true if the item has equal sockets', function() {
        expect($scope.socketsFilter(
          { sockets: $scope.sockets }
        )).toEqual(true);
      });

      it('returns true if the item has more sockets', function() {
        expect($scope.socketsFilter(
          { sockets: $scope.sockets + 1 }
        )).toEqual(true);
      });

      it('returns false if the item has less sockets', function() {
        expect($scope.socketsFilter(
          { sockets: $scope.sockets - 1 }
        )).toEqual(false);
      });
    });
  });

  describe('when the item type does not exist', function() {
    beforeEach(function() {
      itemsModalCtrl = $controller('ItemsModalCtrl', {
        $scope: $scope,
        itemType: 'nonExistent',
        sockets: fakeSockets,
        itemsList: fakeItemsList
      });
    });

    describe('initialization', function() {
      it('sets itemTypeMissing to true', function() {
        expect($scope.itemTypeMissing).toEqual(true);
      });
    });
  });
});
