/* global expect */
/* global inject */
"use strict";

describe('RuneWordFilter', function() {
  var RuneWordFilter;

  beforeEach(function() {
    module("runemaster");

    inject(function(_RuneWordFilter_) {
      RuneWordFilter = _RuneWordFilter_;
    });
  });

  describe('#filterByItemType', function() {
    var fakeItemType = 'Shield';
    var fakeRuneWord = {
      allowed_items: [ { type: fakeItemType } ]
    };

    it('returns true for the default item type', function() {
      expect(RuneWordFilter.filterByItemType(
        fakeRuneWord, RuneWordFilter.getItemTypeDefaultLabel()
      )).toEqual(true);
    });

    it('returns true when the item type matches', function() {
      expect(RuneWordFilter.filterByItemType(
        fakeRuneWord, fakeItemType
      )).toEqual(true);
    });

    it('returns false otherwise', function() {
      expect(RuneWordFilter.filterByItemType(
        fakeRuneWord, "Something Else"
      )).toEqual(false);
    });
  });

  describe('#filterByLadderAllowed', function() {
    describe('when ladder is allowed', function() {
      it('returns true', function() {
        expect(
          RuneWordFilter.filterByLadderAllowed(null, true)
        ).toEqual(true);
      });
    });

    describe('when ladder is not allowed', function() {
      it('returns true if the runeword is not ladder only', function() {
        var fakeRuneWord = { ladder_only: false };

        expect(
          RuneWordFilter.filterByLadderAllowed(fakeRuneWord, false)
        ).toEqual(true);
      });

      it('returns false otherwise', function() {
        var fakeRuneWord = { ladder_only: true };

        expect(
          RuneWordFilter.filterByLadderAllowed(fakeRuneWord, false)
        ).toEqual(false);
      });
    });
  });

  describe('#filterBySearchText', function() {
    var fakeRuneWord = { name: 'Fake' };

    describe('when searchText is empty', function() {
      it('returns true', function() {
        expect(
          RuneWordFilter.filterBySearchText(fakeRuneWord, null)
        ).toEqual(true);
      });
    });

    describe('when searchText is present', function() {
      it('returns true if the runeword contains the searchText', function() {
        expect(
          RuneWordFilter.filterBySearchText(fakeRuneWord, 'Fa')
        ).toEqual(true);
      });

      it('returns false otherwise', function() {
        expect(
          RuneWordFilter.filterBySearchText(fakeRuneWord, 'Na')
        ).toEqual(false);
      });
    });
  });

  describe('#filterByRunesNeeded', function() {
    var fakeRuneWord = { rune_order: ['El', 'Eld', 'Ko'] };

    it('returns true for the default runes needed', function() {
      expect(RuneWordFilter.filterByRunesNeeded(
        fakeRuneWord, 2, RuneWordFilter.getRunesNeededDefaultLabel()
      )).toEqual(true);
    });

    it('returns true when the runes needed matches the amount owned', function() {
      expect(RuneWordFilter.filterByRunesNeeded(
        fakeRuneWord, 1, 2
      )).toEqual(true);
    });

    it('returns false otherwise', function() {
      expect(RuneWordFilter.filterByRunesNeeded(
        fakeRuneWord, 1, 1
      )).toEqual(false);
    });
  });
});
