import React from 'react'
import MapChart from '../app/component/MapChart'

function Home() {
  return (
    <div className="mx-auto w-fit my-5 space-y-3">
      <h1 className=" text-3xl font-bold text-center">Global Issues of Migration</h1>
        <MapChart/>
    </div>
  )
}

export default Home