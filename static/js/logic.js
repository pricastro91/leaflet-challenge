  // We create the tile layer that will be the background of our map.
  var basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
  

// Create map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    
});


// Adding our 'basemap' tile layer to the map.
basemap.addTo(myMap);


var earthquakes = new L.LayerGroup();

// Defining an object that contains our map for use in the layer control.
var baseMaps = {
    "Global Earthquakes": basemap,
    };


// We define an object that contains all of our overlays. Any combination of
// these overlays may be visible at the same time!
var overlays = {
    Earthquakes: earthquakes
  };
  

// Create a control
    // Pass in baseMaps and overlayMaps
    // Add the control to the map
    L.control.layers(baseMaps, overlays, {
        collapsed: false
}).addTo(myMap); 



// Define API endpoint as Url
let Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// request query to URL
d3.json(Url).then(function(dataPoints) {
    //console.log(dataPoints);
    // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
}
// Here we add a GeoJSON layer to the map once the file is loaded.
L.geoJson(dataPoints, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of
    // the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
    // We add the data to the earthquake layer instead of directly to the map.
  }).addTo(earthquakes);

});

 //Change marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#91cf60' :
                         '#1a9850' ;          

// function markerColor(depth){
//     if (depth < 10) return "#00FF00";
//     else if (depth < 30) return "greenyellow";
//     else if (depth < 50) return "yellow";
//     else if (depth < 70) return "orange";
//     else if (depth < 90) return "orangered";
//     else return "#FF0000";



}


  
// marker size adjustment
function markerSize(magnitude) {
    if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 4;
  
}

// Define the markers with size proportional to magnitude. Colour varies with depth of quake.
function markerPlot(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 1,
        stroke: True
    });
    
}





earthquakes.addTo(myMap)


    
    // --------------------------------------------------------------
    //https://www.igismap.com/legend-in-leafletjs-map-with-topojson/
    //https://leafletjs.com/examples/choropleth/

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            //grades = [10, 30, 50, 70, 90];
            labels = [];
            //legendInfo = "<h5>Magnitude</h5>";

        //div.innerHTML += "<h4>Legend</h4>";
        //div.innerHTML += "<h5>(Epicenter Depth)</h5>";
        //grades.length

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    
        //-----------------------------------------------------------------
        // for (var i = 0; i < depth.length; i++) {
        //   div.innerHTML +=
        //       '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
        //       depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        // }    
        //------------------------------------------------------------------
        return div;
        
    };

   
        // Add legend to map
    legend.addTo(myMap);
    // --------------------------------------------------------------


