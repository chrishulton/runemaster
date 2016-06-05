require 'mixins/arreat_scraper'
include ArreatScraper

@rune_recipes = {}

def add_mixed_rune_formula(recipe, ladder_only)
  formula_results = recipe.content.match(/(\d+) (\w+) Runes \+ (\d+) ([\w ]+) = (\w+) Rune/)
  @rune_recipes[formula_results[5]] = {
    :ladder_only => ladder_only,
    :formula => [
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
end


doc = Nokogiri::HTML(open("#{ArreatScraper::ARREAT_SUMMIT_DOMAIN}/diablo2exp/items/cube.shtml"))

low_rune_recipes = doc.xpath("//table[@cellpadding=5]//blockquote")
low_rune_recipes.inner_html.squish.split("<br>").each do |recipe|
  formula_results = recipe.squish.match(/(\d+) (\w+) Runes -&gt; (\d+) (\w+) Rune/)

  @rune_recipes[formula_results[4]] = {
    :ladder_only => false,
    :formula => [
      {
        :name => formula_results[2],
        :type => :rune,
        :quantity => formula_results[1]
      }
    ]
  }
end

mid_rune_recipes = doc.xpath("//table[@cellpadding=5]/tr[1]//b[contains(text(), 'Runes')][contains(text(), '+')]")
mid_rune_recipes.each do |recipe|
  add_mixed_rune_formula(recipe, false)
end

high_rune_recipes = doc.xpath("//table[@cellpadding=5]/tr[2]//b[contains(text(), 'Runes')][contains(text(), '+')]")
high_rune_recipes.each do |recipe|
  add_mixed_rune_formula(recipe, true)
end

ArreatScraper::json_to_file("rune_recipes", @rune_recipes)
