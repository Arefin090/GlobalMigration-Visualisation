import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useRouter } from "next/router";

function MapChart() {
  const router = useRouter();
  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    // Remove the old svg
    d3.select("#chart").select("svg").remove();

    var width = 960;
    var height = 600;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const projection = d3
      .geoMercator()
      .scale(170)
      .translate([width / 2, height / 1.4]);
    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");
    var color = d3
      .scaleQuantize()
      .range(["#ffffcc", "#253494"]);

    d3.csv("countries.csv").then(function (data) {
      color.domain([
        d3.min(data, function (d) {
          return d.Value;
        }),
        d3.max(data, function (d) {
          return d.Value;
        }),
      ]);

      d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
      ).then(function (json) {
        const countries = topojson.feature(json, json.objects.countries);

        for (var i = 0; i < data.length; i++) {
          var dataCountry = data[i].Country;

          var dataValue = parseFloat(data[i].Value);

          for (var j = 0; j < countries.features.length; j++) {
            var jsonCountry = countries.features[j].properties.name;

            if (dataCountry == jsonCountry) {
              countries.features[j].properties.value = dataValue;

              break;
            }
          }
        }

        g.selectAll("path")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", path)
          .style("fill", function (d) {
            var value = d.properties.value;

            if (value) {
              return color(value);
            } else {
              return "#CCC";
            }
          })
          .on("click", function(event, d){

            if(d.properties.value){
              router.push({
                pathname: "/detail",
                query:{
                  country: d.properties.name
                }
              })
            } 
            
          })
          .on("mousemove", function (event, d) {
            d3.select(this).attr("fill", "orange");

            var mousePos = [event.clientX, event.clientY];
            var value = d.properties.value ? parseInt(d.properties.value).toLocaleString("en-US") : "Unknown";

            if(value != "Unknown"){
              d3.select("#mainTooltip")
              .style("left", mousePos[0] + "px")
              .style("top", mousePos[1] + "px")
              .select("#value")
              .attr("text-anchor", "middle")
              .html(
                d.properties.name +
                  "<br />" +
                  value
                 + " People"
              );

            d3.select("#mainTooltip").classed("hidden", false);
            }
            
          })
          .on("mouseout", function (d) {
            d3.select(this).attr("fill", "#2A58BF");
            d3.select("#mainTooltip").classed("hidden", true);
          });
      });
    });
  };

  return (
    <div >
      <div id="chart" className=" cursor-pointer"></div>
      <div id="mainTooltip" className="hidden">
          <p>
            <span id="value"></span>
          </p>
        </div>
        <div className=" w-[1000px] border-2 border-primary rounded-lg mt-5 py-4 px-4 space-y-4  shadow-lg select-none">
        <h1 className="text-2xl font-bold text-center ">Description</h1>
        <p className=" text-lg text-left">
        Welcome to our Global Migration Map! Here, you'll be able to observe the total number of displaced individuals across various countries. The darker the color, the larger the number of displaced people residing in that country. Click on a specific country to explore more details about the factors influencing global migration. This interactive feature provides insights into the global displacement situation and highlights the countries most affected by this phenomenon.
        </p>
      </div>
    </div>
  );
}

export default MapChart;
