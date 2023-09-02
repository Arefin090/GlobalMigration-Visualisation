import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Select from "react-select";
import { countries, countryOptions } from "../options";
import { useRouter } from "next/router";

function BarChart({ timeRange }) {
  const router = useRouter();
  const {country} = router.query;
  var defaultOption = countries.includes(country) ? [{label: country, value: country}]: [];
  const [selectedOption, setSelectedOption] = useState( defaultOption);


  useEffect(() => {
    const keys = selectedOption.map((option) => option.value);
    // Remove the old svg
    d3.select("#mainChart").select("svg").remove();
    drawChart(keys);
  }, [timeRange, selectedOption]);

  function drawChart(keys) {
    var width = 800,
      height = 400;

    var svg = d3
      .select("#mainChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var margin = 150,
      width = svg.attr("width") - margin,
      height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
      yScale = d3.scaleLinear().range([height, 0]);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("conflict.csv").then(function (dataList) {
      //filter by year
      var data = dataList.filter(
        (item) =>
          item.Year >= 2013 + timeRange[0] && item.Year <= 2013 + timeRange[1]
      );

      //filter by countries
      if (keys.length > 0) {
        data.map((d)=>{
          var total = 0;

          keys.map((key) => {
            if (d[key] != "") {
              total += parseInt(d[key]);
            }
          });

          d.Total = total;
        })

      }

      xScale.domain(
        data.map(function (d) {
          return d.Year;
        })
      );
      yScale.domain([
        0,
        d3.max(data, function (d) {
          return d.Total;
        }),
      ]);

      g.append("g")
        .style("font", "16px times")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

      g.append("g")
        .style("font", "16px times")
        .call(
          d3
            .axisLeft(yScale)
            .tickFormat(function (d) {
              return d.toLocaleString("en-US");
            })
            .ticks(10)
        )
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

      // Add X axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width + 100)
        .attr("y", height + 145)
        .style("font", "22px times")
        .text("Time (year)");

      // Add Y axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 100)
        .attr("y", 70)
        .style("font", "22px times")
        .text("#of Internally Displaced People (IDPs)")
        .attr("text-anchor", "start");

      //insert bar
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return xScale(d.Year);
        })
        .attr("y", function (d) {

          return yScale(d.Total);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {

          return height - yScale(d.Total);
        })
        .attr("fill", "#2A58BF")
        .on("mousemove", function (event, d) {
          d3.select(this).attr("fill", "orange");

          var mousePos = [event.clientX, event.clientY];

          d3.select("#mainTooltip")
            .style("left", mousePos[0] + "px")
            .style("top", mousePos[1] + "px")
            .select("#value")
            .attr("text-anchor", "middle")
            .html(
              d.Year +
                "<br />" +
                parseInt(d.Total).toLocaleString("en-US") +
                " People"
            );

          d3.select("#mainTooltip").classed("hidden", false);
        })
        .on("mouseout", function (d) {
          d3.select(this).attr("fill", "#2A58BF");
          d3.select("#mainTooltip").classed("hidden", true);
        });
    });
  }
  return (
    <div className="w-[800px]">
      <label className=" text-lg font-semibold"> Select Countries of Origin</label>
      <Select
        value={selectedOption}
        onChange={setSelectedOption}
        isMulti
        options={countryOptions}
        name="Select Countries"
        className=" w-[350px] mb-4"
        classNamePrefix="select"
      />
      <div className="  border-2 px-10 py-5 flex flex-col justify-center items-center space-y-1 border-primary rounded-lg shadow-lg select-none">
        <h1 className=" text-2xl font-bold">Conflict & Violence</h1>
        {/* <svg width="900" height="500"></svg> */}
        <div id="mainChart"></div>
        <div id="mainTooltip" className="hidden">
          <p>
            <span id="value"></span>
          </p>
        </div>
        <p>Total number of IDPs</p>
      </div>
      <div className=" min-h-[200px] border-2 border-primary rounded-lg mt-5 py-4 px-4 space-y-4  shadow-lg select-none">
        <h1 className="text-2xl font-bold text-center ">Description</h1>
        <p className=" text-lg text-left">
        Welcome to the Conflict Bar Chart. This chart depicts the number of conflicts in various countries over the years, a crucial factor in global migration. The vertical axis represents the number of conflicts, while the horizontal axis denotes different years. A glance at this chart provides a quick understanding of how conflicts have played a significant role in forcing people to move from their homes.You can also exmaine by country specific slecting any country you like from the menu in any timeframe selcting the timescale.
        </p>
      </div>
    </div>
  );
}

export default BarChart;
