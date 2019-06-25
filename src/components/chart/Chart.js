import React from "react";
import CanvasJSReact from "./canvasjs.react";
const CanvasChart = CanvasJSReact.CanvasJSChart;

export const Chart = React.memo(({ data, firstIndex }) => {
  const options = {
    title: {
      text: "Accelerometer data"
    },
    data: [
      {
        type: "line",
        lineColor: "#FF0079",
        dataPoints: data.map((value, index) => ({
          x: firstIndex + index,
          y: value
        }))
      }
    ],
    axisX: {
      title: "ticks",
      minimum: firstIndex,
      interval: 1
    },
    backgroundColor: "#C5FCEE"
  };

  return <CanvasChart options={options} />;
});
