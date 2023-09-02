import { useEffect, useState } from "react";
import classNames from "classnames";
import BarChart from "../app/component/BarChart";
import PieChart from "../app/component/PieChart.jsx";
import StackArea from "../app/component/StackArea";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useRouter } from "next/router";

const ProblemList = {
  Income: "income",
  Conflict: "conflic",
  Disaster: "disaster",
};


export default function Detail() {
  
  const router =useRouter();
  const [dataState, setDataState] = useState(ProblemList.Conflict);
  const [timeRange, setTimeRange] = useState([0, 8]);

  const handleRangeChange = (event, newValue )=>{
    setTimeRange(newValue)
  }

  const calculateValue = (value) =>{
    return 2013 + value;
  }
  return (
    <div className="mx-auto w-fit my-5 space-y-3">
      <button className=" bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md " onClick={()=> router.push("/")}>Back to Map</button>
      <h1 className=" text-3xl font-bold">Global Issues of Migration</h1>
      {/* <h3>Total people by Origin and destination</h3> */}

     
      <button
        className={classNames(
          dataState == ProblemList.Conflict
            ? "bg-blue-700 text-white"
            : "bg-white text-blue-700 border-2 border-blue-700",
          " px-6 py-3 rounded-lg mx-2 shadow-md"
        )}
        onClick={() => setDataState(ProblemList.Conflict)}
      >
        Conflict & Violence
      </button>

      <button
        className={classNames(
          dataState == ProblemList.Disaster
            ? "bg-blue-700 text-white"
            : "bg-white text-blue-700 border-2 border-blue-700",
          " px-6 py-3 rounded-lg mx-2 shadow-md"
        )}
        onClick={() => setDataState(ProblemList.Disaster)}
      >
        Disaster
      </button>
      <button
        className={classNames(
          dataState == ProblemList.Income
            ? "bg-blue-700 text-white"
            : "bg-white text-blue-700 border-2 border-blue-700",
          " px-6 py-3 rounded-lg mx-2 shadow-md"
        )}
        onClick={() => setDataState(ProblemList.Income)}
      >
        Income Groups
      </button>

      {
        dataState != ProblemList.Income ?
        <div >
          <h1 className=" text-lg font-semibold">TimeScale {2013 + timeRange[0]} - {2013 + timeRange[1]} </h1>
        <Box sx={{ width: 200 }} >
        <Slider
          getAriaLabel={() => "Time range"}
          value={timeRange}
          min={0}
          step={1}
          max={8}
          scale={calculateValue}
          onChange={handleRangeChange}
          valueLabelDisplay="auto"
        />
      </Box>
      
      </div>:<div></div>
      }
      

      {dataState == ProblemList.Income ? <PieChart /> : dataState == ProblemList.Conflict ? <BarChart timeRange={timeRange}/> : <StackArea timeRange={timeRange}/>}
    </div>
  );
}
