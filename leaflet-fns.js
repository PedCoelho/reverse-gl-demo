//Initial Map Setup
import token from "./map_token.js";

export default {
  createMap: (id) => {
    let map = L.map(id);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: token,
      }
    ).addTo(map);

    map.centerMap = (lat, lng) => map.setView([lat, lng], 13);
    map.start_mark = createMarker(map, "./assets/start.png", [7, 7]);
    map.end_mark = createMarker(map, "./assets/x.png");
    map.polyline = createPolyline(map);

    return map;
  },
};
function createPolyline(map) {
  let polyline = L.polyline([[]], {
    color: "red",
  }).addTo(map);

  polyline.updateCoords = (coords, accThreshold) => {
    // map coords to array of LatLng points
    let threshold = accThreshold ? accThreshold : 150;

    coords = coords
      .filter((x) => x.accuracy <= threshold)
      .map(({ lat, lon }) => [lat, lon]);

    console.log(coords);

    polyline.setLatLngs(coords);

    map.start_mark.setLatLng(coords[0]);
    map.end_mark.setLatLng(coords[coords.length - 1]);

    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
  };

  return polyline;
}

function createMarker(map, image_src, anchor) {
  let customIcon = L.icon({
    iconUrl: image_src,
    iconSize: [14, 14],
    iconAnchor: anchor || [7, 10],
  });

  let marker = L.marker([0, 0], {
    icon: customIcon,
  }).addTo(map);

  return marker;
}
