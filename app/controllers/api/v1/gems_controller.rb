class Api::V1::GemsController < ApplicationController
  def index
    @data ||= File.read("app/fixtures/gems.json")
    render :json => @data
  end
end
