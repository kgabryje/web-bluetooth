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
    axisY: {
      title: "9.81 m/s^2",
      minimum: 0,
    },
    backgroundColor: "#C5FCEE"
  };

  return <CanvasChart options={options} />;
});
