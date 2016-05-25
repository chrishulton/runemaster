"use strict";

describe('HomeCtrl', function() {
  var $scope, $timeout, $httpBackend, ImgUrls;
  var runesMock, gemsMock, itemsMock, runeWordsMock, runeRecipesMock;
  var homeCtrl;

  beforeEach(function() {
    module("runemaster");

    inject(function($controller, $rootScope, _$httpBackend_, _ImgUrls_) {
      $httpBackend = _$httpBackend_;
      ImgUrls = _ImgUrls_;
      $scope = $rootScope.$new();

      homeCtrl = $controller('HomeCtrl', { $scope: $scope });
    });

    runesMock = $httpBackend.expectGET("/api/v1/runes").respond([])
    gemsMock = $httpBackend.expectGET("/api/v1/gems").respond([]);
    itemsMock = $httpBackend.expectGET("/api/v1/items").respond({});
    runeWordsMock = $httpBackend.expectGET("/api/v1/rune_words").respond([]);
    runeRecipesMock = $httpBackend.expectGET("/api/v1/rune_recipes").respond({});
  });

  describe('initialization fns', function() {
    describe('adding image urls', function() {
      var fakeEl = {
        name: "El",
        img_url: "el.jpg"
      }
      var fakeEld = {
        name: "Eld",
        img_url: "eld.jpg"
      }
      var fakeTopaz = {
        gem: "Topaz",
        img_url: "topaz.jpg"
      }
      var fakeDiamond = {
        gem: "Diamond",
        img_url: "diamond.jpg"
      }

      beforeEach(function() {
        spyOn(ImgUrls, 'addImgUrl')

        runesMock.respond([fakeEl, fakeEld]);
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
  });

  describe('#countRunesOwned', function() {
    var fakeRuneList = ['El', 'Thul', 'Eld'];

    beforeEach(function() {
      $httpBackend.flush();
    });

    it('correctly counts the matching runes', function() {
      homeCtrl.runesOwned = {
        'El': 0,
        'Eld': 1,
        'Thul': 0,
        'Mal': 1
      }

      expect(homeCtrl.countRunesOwned(fakeRuneList)).toEqual(1);
    });

    it ('returns zero when no runes match', function() {
      homeCtrl.runesOwned = {
        'El': 0,
        'Eld': 0,
        'Thul': 0,
        'Mal': 1
      }

      expect(homeCtrl.countRunesOwned(fakeRuneList)).toEqual(0);
    })

    it ('does not double count duplicate matching runes', function() {
      homeCtrl.runesOwned = {
        'El': 2,
        'Eld': 4,
        'Thul': 0,
        'Mal': 1
      }

      expect(homeCtrl.countRunesOwned(fakeRuneList)).toEqual(2);
    })
  })

  describe('#runeConditionMet', function() {
    var fakeRuneList = ['El', 'Thul', 'Eld', 'El'];

    beforeEach(function() {
      $httpBackend.flush();
    });

    it('returns true for the first index if one rune is owned', function() {
      homeCtrl.runesOwned = {
        'El': 1,
        'Eld': 4,
      }

      expect(homeCtrl.runeConditionMet('El', fakeRuneList, 0)).toEqual(true);
    });

    it('returns false for the second index if one rune is owned', function() {
      homeCtrl.runesOwned = {
        'El': 1,
        'Eld': 4,
      }

      expect(homeCtrl.runeConditionMet('El', fakeRuneList, 3)).toEqual(false);
    });

    it('returns true for the second index if two runes are owned', function() {
      homeCtrl.runesOwned = {
        'El': 2,
        'Eld': 4,
      }

      expect(homeCtrl.runeConditionMet('El', fakeRuneList, 3)).toEqual(true);
    });
  });
});
