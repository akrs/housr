var los_angeles_coordinates = [-118.25, 34.05];
require([
    "esri/map",
    "esri/layers/graphics",
    "esri/layers/FeatureLayer",
    "esri/InfoTemplate",
    "esri/graphicsUtils",
    "dojo/keys",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!",
    "dijit/form/ToggleButton"
  ],
  function(Map, Graphics, FeatureLayer, InfoTemplate, graphicsUtils, keys, on, dom) {
    "use strict"

    // Create map
    var map = new Map("mapDiv", {
      basemap: "streets",
      center: los_angeles_coordinates,
      zoom: 14
    });

    // Set popup
    var popup = map.infoWindow;
    popup.highlight = false;
    popup.titleInBody = false;
    popup.domNode.style.marginTop = "-5px";

    function createFeatureLayer (url) {
      var infoTemplate = new InfoTemplate("Feature Data", "${*}");
      return new FeatureLayer(url, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: infoTemplate
      });
    }

    function toggleService(divId, featureLayer) {
      if ($(divId).hasClass("active")) {
        removeFeatureService(featureLayer);
      } else {
        addFeatureService(featureLayer);
      }
      $(divId).toggleClass("active");
    }

    function addFeatureService(featureLayer) {
      console.log("adding feature layer");
      map.addLayer(featureLayer);
    }

    // Remove existing service
    function removeFeatureService(featureLayer) {
      console.log("removing feature layer");
      map.removeLayer(featureLayer);
      map.infoWindow.hide();
    }

    var coffeeURL = "http://services3.arcgis.com/7LJujXVDAGlq47mO/arcgis/rest/services/Portland_Coffee_Shops/FeatureServer/0",
        laiURL = "http://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/LocationAffordabilityIndexData/FeatureServer/0",
        metroURL = "http://services3.arcgis.com/EWU1UBZxjEWlgj4C/ArcGIS/rest/services/Los_Angeles_County_Metro_Bus_Routes/FeatureServer/0";
    var coffeeFeatureLayer = createFeatureLayer(coffeeURL),
        laiFeatureLayer = createFeatureLayer(laiURL),
        metroFeatureLayer = createFeatureLayer(metroURL);

    $("#coffee-layer").click(function () {
      toggleService("#coffee-layer", coffeeFeatureLayer);
    });
    $("#lai-layer").click(function () {
      toggleService("#lai-layer", laiFeatureLayer);
    });
    $("#metro-layer").click(function () {
      toggleService("#metro-layer", metroFeatureLayer);
    });

});
