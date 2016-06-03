/* global browser */
/* global by */
/* global element */
/* global expect */
"use strict";

describe('user updates runes owned', function() {
  beforeEach(function() {
    browser.get("/");
    browser.waitForAngular();
  });

  var apRuneWord = element(by.css('.runeWordList tbody tr:nth-child(1)'));
  var runeOrderCell = apRuneWord.element(by.css('td:nth-child(3)'));
  var ralOwnedInput = element(by.name('runesOwned--Ral'));

  it("updates the progress bar and rune word counts as runes owned changes", function() {
    ralOwnedInput.sendKeys(1).then(function() {
      expect(
        runeOrderCell.element(by.css('li:nth-child(1)')).getText()
      ).toEqual('Ral (1)');

      expect(
        runeOrderCell.element(by.css('.progress-bar')).getAttribute('aria-valuenow')
      ).toEqual('1');

      ralOwnedInput.clear().then(function() {
        expect(
          runeOrderCell.element(by.css('li:nth-child(1)')).getText()
        ).toEqual('Ral');

        expect(
          runeOrderCell.element(by.css('.progress-bar')).getAttribute('aria-valuenow')
        ).toEqual('0');
      });
    });
  });

  it("persists the rune counts between visits", function() {
    expect(ralOwnedInput.getAttribute('value')).toEqual('0');

    ralOwnedInput.sendKeys(1).then(function() {
      browser.get('/');
      browser.waitForAngular();

      expect(ralOwnedInput.getAttribute('value')).toEqual('1');

      ralOwnedInput.clear().then(function() {
        browser.get('/');
        browser.waitForAngular();

        expect(ralOwnedInput.getAttribute('value')).toEqual('0');
      });
    });
  });
});
