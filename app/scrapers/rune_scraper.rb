require 'nokogiri'
require 'open-uri'
require 'multi_json'

rune_property_keys = ["img_url"]
runes = []

ARREAT_SUMMIT_DOMAIN = "http://classic.battle.net/"

doc = Nokogiri::HTML(open("#{ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/runes.shtml"))
rune_table = doc.xpath('//table[@cellpadding=5]')

rune_table.xpath('tr').each_with_index do |row,index|
  if index == 0
    row.xpath('.//span').each do |property|
      rune_property_keys << property.content.downcase.gsub(/\//,'-')
    end
  else
    rune_property_values = ["#{ARREAT_SUMMIT_DOMAIN}#{row.xpath('.//img')[0].attr('src')}"]

    row.xpath('.//span').each do |property|
      rune_property_values << property.content
    end

    rune = {}
    rune_property_values.each_with_index do |property,index|
      rune[rune_property_keys[index]] = property
    end

    runes << rune
  end
end

File.open("app/fixtures/runes.json", "w") do |f|
  f.write(MultiJson.dump(runes))
end
