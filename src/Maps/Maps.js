/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";
import GoogleMapsApiLoader from "google-maps-api-loader";
import "../styles/map.css";

export default function Map(props) {
  const { coordsInicio, coordsFinal, coordsParadas } = props;

  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  useEffect(() => {
    GoogleMapsApiLoader({
      libraries: ["places", "visualization"],
      apiKey: "AIzaSyCqMkRlzo-OHKohU-0ovuLBbNvt6O4wczQ" // optional
    }).then(
      function (google) {
        let start;
        let heatmapData = [];
        let start2;
        let heatmapData2 = [];
        let startParada;
        let heatmapDataparada = [];

        coordsInicio.forEach(coord => {
          if (coord[0] && coord[1])
            heatmapData.push(new google.maps.LatLng(coord[0], coord[1]));
        });
        coordsFinal.forEach(coord => {
          if (coord[0] && coord[1])
            heatmapData2.push(new google.maps.LatLng(coord[0], coord[1]));
        });
        coordsParadas.forEach(coord => {
          if (coord[0] && coord[1])
            heatmapDataparada.push(new google.maps.LatLng(coord[0], coord[1]));
        });
        start = new google.maps.LatLng(coordsInicio[0][0], coordsInicio[0][1]);
        start2 = new google.maps.LatLng(coordsFinal[0][0], coordsFinal[0][1]);
        startParada = new google.maps.LatLng(coordsParadas[0][0], coordsParadas[0][1]);
        const map = new google.maps.Map(ref.current, {
          center: start,
          zoom: 5,
          mapTypeId: "roadmap"
        });
        const heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          radius: 16
        });

        const map2 = new google.maps.Map(ref2.current, {
          center: start2,
          zoom: 5,
          mapTypeId: "roadmap"
        });

        const heatmap2 = new google.maps.visualization.HeatmapLayer({
          data: heatmapData2,
          radius: 16
        });
        const mapParadas = new google.maps.Map(ref3.current, {
          center: startParada,
          zoom: 5,
          mapTypeId: "roadmap"
        });

        const heatmapParadas = new google.maps.visualization.HeatmapLayer({
          data: heatmapDataparada,
          radius: 16
        });

        heatmap.setMap(map);
        heatmap2.setMap(map2);
        heatmapParadas.setMap(mapParadas);
      },
      function (err) {
        console.error(err);
      }
    );
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <div className="content">
        <div className="title">Heat Map most common start points</div>
        <div
          ref={ref}
          style={{ height: "50vh", width: "30vw", margin: "10px 0" }}
        ></div>
      </div>

      <div className="content">
        <div className="title">Heat Map most common end points</div>
        <div
          ref={ref2}
          style={{ height: "50vh", width: "30vw", margin: "10px 0" }}
        ></div>
      </div>
      <div className="content">
        <div className="title">Heat Map most visited stops</div>
        <div
          ref={ref3}
          style={{ height: "50vh", width: "30vw", margin: "10px 0" }}
        ></div>
      </div>
    </React.Fragment>
  );
}
