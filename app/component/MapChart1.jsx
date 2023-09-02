import React, { useEffect, useState } from "react";
import * as d3 from "d3";
function MapChart1() {
  const [mapData, setMapData] = useState();

  useEffect(() => {

    
    var w = 500;
    var h = 300;

    var projection = d3
      .geoMercator()
      .center([145, -36.5])
      .translate([w / 2, h / 2])
      .scale(2450);

    var path = d3.geoPath().projection(projection);

    // Remove the old svg
    d3.select('#chart')
      .select('svg')
      .remove();

    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "grey");

    d3.json("./LGA_VIC.json").then(function (json) {
      svg
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path);
    });
  },[]);

  return <div id="chart"></div>;
}

export default MapChart1;
