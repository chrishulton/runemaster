require 'mixins/arreat_scraper'
include ArreatScraper

rune_property_keys = ["img_url"]
runes = []

doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/runes.shtml"))
rune_table = doc.xpath('//table[@cellpadding=5]')

ArreatScraper::parse_item_table(rune_table, rune_property_keys, runes)

rune_drop_odds = {}

rune_odds_doc = Nokogiri::HTML(open("./app/fixtures/rune_odds.html"))
rune_odds_table = rune_odds_doc.xpath('//table/tbody')

rune_odds_table.xpath('tr').each_with_index do |row, row_index|
  next if row_index == 0

  rune_name = row.xpath('td')[0].content.squish.match(/(\w+) Rune/)[1]
  rune_odds = row.xpath('td')[2].content.squish

  rune_drop_odds[rune_name] = rune_odds
end

runes.each do |rune|
  rune["odds"] = rune_drop_odds[rune["name"]]
end

ArreatScraper::json_to_file("runes", runes)
