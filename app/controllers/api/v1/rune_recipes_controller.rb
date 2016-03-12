class Api::V1::RuneRecipesController < ApplicationController
  def index
    @data ||= File.read("app/fixtures/rune_recipes.json")
    render :json => @data
  end
end
