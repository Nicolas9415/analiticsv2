import React, { useRef } from "react";
import GoogleMapsApiLoader from "google-maps-api-loader";

//const openGeocoder = require("node-open-geocoder");

export default function Map(props) {
  const { coords } = props;

  const ref = useRef(null);

  GoogleMapsApiLoader({
    libraries: ["places", "visualization"],
    apiKey: "AIzaSyCqMkRlzo-OHKohU-0ovuLBbNvt6O4wczQ" // optional
  }).then(
    function(google) {
      let fullCoords;
      let start;
      let heatmapData = [];

      fullCoords = coords.map(e => [e.latitude, e.longitude]);

      fullCoords.map(coord =>
        heatmapData.push(new google.maps.LatLng(coord[0], coord[1]))
      );

      start = new google.maps.LatLng(fullCoords[0][0], fullCoords[0][1]);

      const map = new google.maps.Map(ref.current, {
        center: start,
        zoom: 14,
        mapTypeId: "roadmap"
      });

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 25
      });
      heatmap.setMap(map);
    },
    function(err) {
      console.error(err);
    }
  );
  return (
    <div
      ref={ref}
      style={{ height: "50vh", width: "30vw", margin: "10px 0" }}
    ></div>
  );
}
