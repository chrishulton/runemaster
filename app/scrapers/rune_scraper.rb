require 'mixins/arreat_scraper'
include ArreatScraper

rune_property_keys = ["img_url"]
runes = []

doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/runes.shtml"))
rune_table = doc.xpath('//table[@cellpadding=5]')

ArreatScraper::parse_item_table(rune_table, rune_property_keys, runes)

ArreatScraper::json_to_file("runes", runes)
