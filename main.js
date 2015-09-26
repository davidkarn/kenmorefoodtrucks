var king_county_parcels     = 'yrp3-3hu8';
var commercial_buildings    = 'b6gg-b3a4';
var vacant_lots             = 'mdtz-kt2d';
var employment_stats        = '6bn5-2933';
var liquor_licenses         = 'mjvz-43ce';
var kenmore_zip             = 98028;
var kenmore_coords          = [47.752778, -122.247222];
var mapbox_id               = 'davidkarn.ni38i7gd';
var mapbox_access_token     = ('pk.eyJ1IjoiZGF2aWRrYXJuIiwiYSI6ImNpZjFmdXlpYzBmbDB'
                               + 'zcW01bDF3b3kyMTIifQ.-ilX5JP9cl1MrPMQUZJ6Gw');
var layers                  = {};
var map;

function lookup(resource, query, next, error) {
    var query_params = {};
    if (query.where)
        query_params['$where'] = query.where.join(" AND ");
    
    var url          = ('https://kenmorewa.data.socrata.com/resource/' + resource
                        + '?' + obj_to_urlstring(query_params));
    
    $.ajax({url:      url,
            method:  'GET'})
        .done(next)
        .fail(error); }

function in_kenmore(query) {
    query = query || {};
    query.where = query.where || [];
    query.where.push("zip_code='" + kenmore_zip + "'");
    return query; }

function in_kenmore_parcel(query) {
    query = query || {};
    query.where = query.where || [];
    query.where.push('zip_code = ' + kenmore_zip);
    return query; }

function socrata_commercial_buildings_latlngs(next) {
    lookup(commercial_buildings, in_kenmore(),
           function(buildings) {
               var coords = buildings.map(function(building) {
                   return [parseFloat(building.latitude), parseFloat(building.longitude)]; });
               next(coords); }); }
               
function plot_coords_heat(coords, layer) {
    layer           = layer || Math.random().toString();
    var map_layer   = layers[layer];
    
    if (map_layer) {
        map_layer.setLatLngs(coords);
        map_layer.redraw(); }
    
    layers[layer] = L.heatLayer(coords, {});
    layers[layer].addTo(map); }

function init_map() {
    map = L.map('map')
        .setView(kenmore_coords, 13);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {attribution: 'osm'})
        .addTo(map);
    return map; }

$(document).ready(function() {
    init_map();
    socrata_commercial_buildings_latlngs(plot_coords_heat); });
