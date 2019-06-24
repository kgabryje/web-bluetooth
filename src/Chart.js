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
      title: "g",
      minimum: 0
    }
  };

  return (
    <div style={{ maxWidth: "64em", margin: "auto" }}>
      <CanvasChart options={options} />
    </div>
  );
});
