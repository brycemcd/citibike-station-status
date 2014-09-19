require 'rubygems'
require 'bundler'

Bundler.require

require './lib/citi_bike_census'
run CitiBikeCensus::Application
