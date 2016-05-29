/* global expect */
/* global inject */
/* global spyOn */
"use strict";

describe('HomeCtrl', function() {
  var $httpBackend, $scope, $uibModal, localStorageService, ImgUrls, RuneWordFilter;
  var runesMock, gemsMock, itemsMock, runeWordsMock, runeRecipesMock;
  var homeCtrl;

  beforeEach(function() {
    module("runemaster");

    inject(function($controller, $rootScope, _$httpBackend_, _$uibModal_, _localStorageService_, _ImgUrls_, _RuneWordFilter_) {
      $httpBackend = _$httpBackend_;
      $uibModal = _$uibModal_;
      localStorageService = _localStorageService_;
      ImgUrls = _ImgUrls_;
      RuneWordFilter = _RuneWordFilter_;
      $scope = $rootScope.$new();

      homeCtrl = $controller('HomeCtrl', { $scope: $scope });
    });

    runesMock = $httpBackend.expectGET("/api/v1/runes").respond([]);
    gemsMock = $httpBackend.expectGET("/api/v1/gems").respond([]);
    itemsMock = $httpBackend.expectGET("/api/v1/items").respond({});
    runeWordsMock = $httpBackend.expectGET("/api/v1/rune_words").respond([]);
    runeRecipesMock = $httpBackend.expectGET("/api/v1/rune_recipes").respond({});
  });


  describe('initialization fns', function() {
    var fakeEl = { name: "El", img_url: "el.jpg" };
    var fakeEld = { name: "Eld", img_url: "eld.jpg" };

    beforeEach(function() {
      runesMock.respond([fakeEl, fakeEld]);
    });

    describe('#addItemImageUrls', function() {
      var fakeTopaz = { gem: "Topaz", img_url: "topaz.jpg" };
      var fakeDiamond = { gem: "Diamond", img_url: "diamond.jpg" };

      beforeEach(function() {
        spyOn(ImgUrls, 'addImgUrl');

        gemsMock.respond([fakeTopaz, fakeDiamond]);

        $httpBackend.flush();
      });

      it('adds img urls for each rune', function() {
        expect(ImgUrls.addImgUrl).toHaveBeenCalledWith(fakeEl.name, fakeEl.img_url);
        expect(ImgUrls.addImgUrl).toHaveBeenCalledWith(fakeEld.name, fakeEld.img_url);
      });

      it('adds img urls for each gem', function() {
        expect(ImgUrls.addImgUrl).toHaveBeenCalledWith(fakeTopaz.gem, fakeTopaz.img_url);
        expect(ImgUrls.addImgUrl).toHaveBeenCalledWith(fakeDiamond.gem, fakeDiamond.img_url);
      });
    });

    describe('#initializeLocalStorage', function() {
      beforeEach(function() {
        spyOn(localStorageService, 'bind');

        $httpBackend.flush();
      });

      it('initalizes local storage for each rune', function() {
        expect(localStorageService.bind).toHaveBeenCalledWith(
          $scope, 'mainVm.runesOwned.'+fakeEl.name, 0, fakeEl.name
        );
        expect(localStorageService.bind).toHaveBeenCalledWith(
          $scope, 'mainVm.runesOwned.'+fakeEld.name, 0, fakeEld.name
        );
      });
    });

    describe('resourcesLoaded', function() {
      it('is flipped to true when all requests complete', function() {
        expect(homeCtrl.resourcesLoaded).toEqual(false);

        $httpBackend.flush();

        expect(homeCtrl.resourcesLoaded).toEqual(true);
      });
    });
  });

  describe('#filterRuneWordTable', function() {
    var fakeRunesNeeded = 3;
    var fakeRuneWord = 'fake';

    beforeEach(function() {
      $httpBackend.flush();

      spyOn(homeCtrl, 'countRunesOwned').and.returnValue(3);

      spyOn(RuneWordFilter, 'filterByLadderAllowed').and.returnValue(true);
      spyOn(RuneWordFilter, 'filterByItemType').and.returnValue(true);
      spyOn(RuneWordFilter, 'filterBySearchText').and.returnValue(true);
      spyOn(RuneWordFilter, 'filterByRunesNeeded').and.returnValue(true);
    });

    it('calls each filter with the correct scope params', function() {
      homeCtrl.includeLadderOnly = false;
      homeCtrl.selectedItemType = "Armor";
      homeCtrl.runeWordNameSearchText = "Enigma";
      homeCtrl.selectedRunesNeeded = 3;

      homeCtrl.filterRuneWordTable(fakeRuneWord);

      expect(RuneWordFilter.filterByLadderAllowed).toHaveBeenCalledWith(
        fakeRuneWord, homeCtrl.includeLadderOnly
      );
      expect(RuneWordFilter.filterByItemType).toHaveBeenCalledWith(
        fakeRuneWord, homeCtrl.selectedItemType
      );
      expect(RuneWordFilter.filterBySearchText).toHaveBeenCalledWith(
        fakeRuneWord, homeCtrl.runeWordNameSearchText
      );
      expect(RuneWordFilter.filterByRunesNeeded).toHaveBeenCalledWith(
        fakeRuneWord, fakeRunesNeeded, homeCtrl.selectedRunesNeeded
      );
    });
  });

  describe('#countRunesOwned', function() {
    var fakeRuneList = ['El', 'Thul', 'Eld'];

    beforeEach(function() {
      $httpBackend.flush();
    });

    it('correctly counts the matching runes', function() {
      homeCtrl.runesOwned = { 'El': 0, 'Eld': 1, 'Thul': 0, 'Mal': 1 };
      expect(homeCtrl.countRunesOwned(fakeRuneList)).toEqual(1);
    });

    it ('returns zero when no runes match', function() {
      homeCtrl.runesOwned = { 'El': 0, 'Eld': 0, 'Thul': 0, 'Mal': 1 };
      expect(homeCtrl.countRunesOwned(fakeRuneList)).toEqual(0);
    });

    it ('does not double count duplicate matching runes', function() {
      homeCtrl.runesOwned = { 'El': 2, 'Eld': 4, 'Thul': 0, 'Mal': 1 };
      expect(homeCtrl.countRunesOwned(fakeRuneList)).toEqual(2);
    });
  });

  describe('#runeConditionMet', function() {
    var fakeRuneList = ['El', 'Thul', 'Eld', 'El'];

    beforeEach(function() {
      $httpBackend.flush();
    });

    it('returns true for the first index if one rune is owned', function() {
      homeCtrl.runesOwned = { 'El': 1, 'Eld': 4 };
      expect(homeCtrl.runeConditionMet('El', fakeRuneList, 0)).toEqual(true);
    });

    it('returns false for the second index if one rune is owned', function() {
      homeCtrl.runesOwned = { 'El': 1, 'Eld': 4 };
      expect(homeCtrl.runeConditionMet('El', fakeRuneList, 3)).toEqual(false);
    });

    it('returns true for the second index if two runes are owned', function() {
      homeCtrl.runesOwned = { 'El': 2, 'Eld': 4 };
      expect(homeCtrl.runeConditionMet('El', fakeRuneList, 3)).toEqual(true);
    });
  });

  describe('#openItemsModal', function() {
    var itemType = 'Armor';
    var sockets = 2;

    beforeEach(function() {
      spyOn($uibModal, 'open');

      $httpBackend.flush();
    });

    it('launches the modal with the correct params', function() {
      homeCtrl.openItemsModal(itemType, sockets);

      var modalArgs = $uibModal.open.calls.first().args[0];
      expect(modalArgs.templateUrl).toEqual('items_modal.html');
      expect(modalArgs.controller).toEqual('ItemsModalCtrl');
      expect(modalArgs.windowClass).toEqual('itemsModal');

      expect(modalArgs.resolve.itemType()).toEqual(itemType);
      expect(modalArgs.resolve.sockets()).toEqual(sockets);
      expect(modalArgs.resolve.itemsList()).toEqual(homeCtrl.items);
    });
  });
});
