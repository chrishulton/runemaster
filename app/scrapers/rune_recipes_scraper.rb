require 'mixins/arreat_scraper'
include ArreatScraper

rune_recipes = []

doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/cube.shtml"))

low_rune_recipes = doc.xpath("//table[@cellpadding=5]//blockquote")
low_rune_recipes.inner_html.squish.split("<br>").each do |recipe|
  formula_results = recipe.squish.match(/(\d+) (\w+) Runes -&gt; (\d+) (\w+) Rune/)

  rune_recipe = {
    :to => {
      :name => formula_results[4],
      :type => :rune,
      :quantity => formula_results[3]
    },
    :from => [
      {
        :name => formula_results[2],
        :type => :rune,
        :quantity => formula_results[1] 
      }
    ]
  }

  rune_recipes << rune_recipe
end

high_rune_recipes = doc.xpath("//table[@cellpadding=5]//b[contains(text(), 'Runes')][contains(text(), '+')]")
high_rune_recipes.each do |recipe|
  formula_results = recipe.content.match(/(\d+) (\w+) Runes \+ (\d+) ([\w ]+) = (\w+) Rune/)
  rune_recipe = {
    :to => {
      :name => formula_results[5],
      :type => :rune,
      :quantity => 1
    },
    :from => [
      {
        :name => formula_results[2],
        :type => :rune,
        :quantity => formula_results[1] 
      },
      {
        :name => formula_results[4],
        :type => :gem,
        :quantity => formula_results[3] 
      }
    ]
  }

  rune_recipes << rune_recipe
end

ArreatScraper::json_to_file("rune_recipes", rune_recipes)
