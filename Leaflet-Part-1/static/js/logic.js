//Define arrays for markers and legend
let colors = ['#7CCD7C', '#B3EE3A', '#FFFF00', '#FFD700', '#FFA500', '#FF6347'];
let grades = [-10, 10, 30, 50, 70, 90];

// Creating the map object
let myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 4
  });

  // Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API query variables.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(url).then(function(response) {

   //legend
   let legend = L.control({ position: 'bottomright' })
   legend.onAdd = function () {
     let div = L.DomUtil.create('div', 'info legend');
     div.style.backgroundColor = 'white';
     div.style.width = '120px'; 
     div.style.height = '150px';  
        for (let i = 0; i < colors.length; i++) {
          div.innerHTML +=
            '<div><span style="background:' + colors[i] + '; width: 20px; height: 20px; display: inline-block;"></span> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
     return div;
   };
   legend.addTo(myMap);

    // Loop through the data.
    for (let i = 0; i < response.features.length; i++) {
  
      // Set the data location property to a variable.
      let location = response.features[i].geometry.coordinates;
      let magnitude = response.features[i].properties.mag;
      let depth = location[2];
      let place = response.features[i].properties.place;

      function getMarkerColor(depth) {
      let normalizedDepth = (depth - grades[0]) / (grades[grades.length - 1] - grades[0]);
      normalizedDepth = Math.max(0, Math.min(normalizedDepth, 1));
      let colorIndex = Math.floor(normalizedDepth * (colors.length - 1));
      colorIndex = Math.max(0, Math.min(colorIndex, colors.length - 1));
      let calculatedColor = colors[colorIndex];
      return calculatedColor;
      }

      function getMarkerRadius(magnitude) {
        return magnitude * 5;
      }

     // Add markers
     let marker = L.circleMarker([location[1], location[0]], {
        radius: getMarkerRadius(magnitude),
        fillColor: getMarkerColor(depth),
        color: getMarkerColor(depth),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      marker.bindPopup(`<strong>Location:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`).addTo(myMap);

    }
  });