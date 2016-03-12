require 'mixins/arreat_scraper'
include ArreatScraper

gem_property_keys = ["img_url"]
gems = []

doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/gems.shtml"))
gem_tables = doc.xpath('//table[@cellpadding=5]')

gem_tables.each do |gem_table|
  ArreatScraper::parse_item_table(gem_table, gem_property_keys, gems)
end

ArreatScraper::json_to_file("gems", gems)
