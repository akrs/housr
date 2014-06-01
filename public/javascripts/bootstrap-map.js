require([
    "application/bootstrapmap",
    "esri/layers/graphics",
    "esri/layers/FeatureLayer",
    "esri/InfoTemplate",
    "esri/graphicsUtils",
    "dojo/keys",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
  ],
  function(BootstrapMap, Graphics, FeatureLayer, InfoTemplate, graphicsUtils, keys, on, dom) {
    "use strict"

    // Create map
    var map = BootstrapMap.create("mapDiv", {
      basemap: "streets",
      center: [-122.68, 45.52],
      zoom: 14
    });

    // Set popup
    var popup = map.infoWindow;
    popup.highlight = false;
    popup.titleInBody = false;
    popup.domNode.style.marginTop = "-5px";

    // Wire map events
    // map.on("layer-add-result", layerAdded);

    // Wire UI events
    // on(dom.byId("btnAdd"), "click", addFeatureService);
    // on(dom.byId("btnRemove"), "click", removeFeatureService);
    on(dom.byId("inputUrl"), "keydown", function(event) {
      if (event.keyCode === keys.ENTER) {
        addFeatureService();
      }
    });

    on(dom.byId("coffee-layer"), "click", toggleCoffeeService);
    // on(dom.byId("lai-layer"), "click", addLaiService);
    // on(dom.byId("metro-layer"), "click", addMetroService);

    function createFeatureLayer (url) {
      var infoTemplate = new InfoTemplate("Feature Data", "${*}");
      return new FeatureLayer(url, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: infoTemplate
      });
    }

    var on = false;
    var coffeeURL = "http://services3.arcgis.com/7LJujXVDAGlq47mO/arcgis/rest/services/Portland_Coffee_Shops/FeatureServer/0",
        laiURL = "http://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/LocationAffordabilityIndexData/FeatureServer/0",
        metroURL = "";
    var coffeeFeatureLayer = createFeatureLayer(coffeeURL),
        laiFeatureLayer = createFeatureLayer(laiURL),
        metroFeatureLayer = createFeatureLayer(metroURL);

    // Create a feature layer to get feature service

    function toggleCoffeeService() {
      if (on) {
        removeFeatureService(coffeeFeatureLayer);
      } else {
        addFeatureService(coffeeFeatureLayer);
      }
    }

    function addFeatureService(featureLayer) {
      on = true;
      console.log("adding feature layer");
      map.addLayer(featureLayer);
    }

    // Remove existing service
    function removeFeatureService(featureLayer) {
      on = false;
      console.log("removing feature layer");
      map.removeLayer(featureLayer);
      map.infoWindow.hide();
    }
});
