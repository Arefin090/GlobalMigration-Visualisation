import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Select from "react-select";
import { hazardOptions } from "../options";

function StackArea({timeRange}) {
  const [selectedOption, setSelectedOption] = useState([]);

  useEffect(() => {

    drawChart();
  }, [timeRange, selectedOption]);

  const drawChart = async() =>{

    //Get data
    var dataList = null;
    var keys = [];
    if(selectedOption.length > 0){
      dataList = await d3.csv("disaster_hazard.csv");
      keys = selectedOption.map((option) => option.value);
    }
    else{
      dataList = await d3.csv("disaster.csv");
      keys = dataList.columns.slice(1);
    }

    // Remove the old svg
    d3.select("#stack").select("svg").remove();

    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 230, bottom: 100, left: 150 },
      width =800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#stack")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // List of groups = header of the csv files

      var data = dataList.filter(
        (item) =>
          item.Year >= 2013 + timeRange[0] && item.Year <= 2013 + timeRange[1]
      );


      // color palette
      var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

      //stack the data?
      var stackedData = d3.stack().keys(keys)(data);
      var x = d3.scaleBand().range([0, width]).padding(1);

      x.domain(
        data.map(function (d) {
          return d.Year;
        })
      );
      var xAxis = svg
        .append("g")
        .style("font", "16px times")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add X axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .style("font", "22px times")
        .text("Time (year)");

      // Add Y axis label:
      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .style("font", "22px times")
        .text("# of Disaster Internal Displacements")
        .attr("text-anchor", "start");

        //get max
        var max = d3.max(data, function(d){

          var list = keys.map((key)=> {
            return parseInt(d[key])
          })
          var m = Math.max(...list)

          return m;
        })

      // Add Y axis
      var y = d3.scaleLinear().domain([0, max ]).range([height, 0]);

      svg.append("g").style("font", "16px times").call(d3.axisLeft(y).ticks(5));

      var clip = svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create the scatter variable: where both the circles and the brush take place
      var areaChart = svg.append("g").attr("clip-path", "url(#clip)");

      // Area generator
      var area = d3
        .area()
        .x(function (d) {
          return x(d.data.Year);
        })
        .y0(function (d) {
          return y(d[0]);
        })
        .y1(function (d) {
          return y(d[1]);
        })

      // Show the areas
      areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", function (d) {
          return "myArea " + d.key;
        })
        .style("fill", function (d) {
          return color(d.key);
        })
        .attr("d", area);

      var idleTimeout;
      function idled() {
        idleTimeout = null;
      }

      var highlight = function (event,d) {
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", 0.1);
        // expect the one that is hovered
        d3.select("." + d).style("opacity", 1);
      };

      // And when it is not hovered anymore
      var noHighlight = function (d) {
        d3.selectAll(".myArea").style("opacity", 1);
      };

      // Add one dot in the legend for each name.
      var size = 20;
      svg
        .selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", 450)
        .attr("y", function (d, i) {
          return 10 + i * (size + 5);
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) {
          return color(d);
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);

      // Add one dot in the legend for each name.
      svg
        .selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 450 + size * 1.2)
        .attr("y", function (d, i) {
          return 10 + i * (size + 5) + size / 2;
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
          return color(d);
        })
        .text(function (d) {
          return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);
  }

  return (
    <div className="w-[800px]">
      <label className=" text-lg font-semibold">Hazard Type</label>
      <Select
        value={selectedOption}
        onChange={setSelectedOption}
        isMulti
        options={hazardOptions}
        name="Select Countries"
        className=" w-[350px] mb-4"
        classNamePrefix="select"
      />
      <div className=" border-2 px-10 py-5 flex flex-col justify-center items-center space-y-1 border-primary rounded-lg shadow-lg select-none">
        <h1 className=" text-2xl font-bold">Disaster</h1>
        <div id="stack"></div>
        <p>Total number of Disaster Internal Displacement</p>
      </div>
      <div className=" min-h-[200px] border-2 border-primary rounded-lg mt-5 py-4 px-4 space-y-4  shadow-lg select-none">
        <h1 className="text-2xl font-bold text-center ">Description</h1>
        <p className=" text-lg text-left">
        Here we have the Disaster Stacked Area Chart. This chart illustrates the impact of natural disasters on global migration patterns over time. By interacting with this visualization, you can track the history of disaster-induced displacements and see how specific events have influenced global migration.
        </p>
      </div>
    </div>
  );
}

export default StackArea;
