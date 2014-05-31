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
      center: [-28,40],
      zoom: 3
    });

    // Set popup
    var popup = map.infoWindow;
    popup.highlight = false;
    popup.titleInBody = false;
    popup.domNode.style.marginTop = "-5px";

    // Wire map events
    map.on("layer-add-result", layerAdded);

    // Wire UI events
    on(dom.byId("btnAdd"), "click", addFeatureService);
    on(dom.byId("btnRemove"), "click", removeFeatureService);
    on(dom.byId("inputUrl"), "keydown", function(event) {
      if (event.keyCode === keys.ENTER) {
        addFeatureService();
      }
    });

    var featureLayer;

    // Create a feature layer to get feature service
    function addFeatureService() {
      removeFeatureService();
      var infoTemplate = new InfoTemplate("Feature Data", "${*}");
      var url = dom.byId("inputUrl").value.trim();
      featureLayer = new FeatureLayer(url, {
        mode: FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        infoTemplate: infoTemplate
      });
      map.addLayer(featureLayer);

    }
    // Remove existing service
    function removeFeatureService() {
      if (featureLayer) {
        map.removeLayer(featureLayer);
        map.infoWindow.hide();
      }
    }
    // Listen for enter key
    function addService_onKeyPress(e) {
      if (e.keyCode == 13 || e.keyCode == "13") {
        addFeatureService();
      }
    }
    // Zoom to layer and update url
    function layerAdded(layer) {
      if (typeof layer.error !== 'undefined') {
        alert("Feature service could not be loaded. Check URL.");
      } else {
        if (featureLayer){
          var layerUpdated = featureLayer.on("update-end", function(result) {
            // Zoom to all of the features
            var extent = graphicsUtils.graphicsExtent(result.target.graphics);
            map.setExtent(extent);
            // Only do this once
            layerUpdated.remove();
            dom.byId("inputUrl").value = result.target.url;
          });
        }
      }
    }
});
