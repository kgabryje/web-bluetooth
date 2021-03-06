import React, { useState, useCallback, useRef } from "react";
import { calcAccFromSensorOutput } from "../helpers";
import { BLEConfigHandler } from "./BLEConfigHandler";
import { Box } from "./Layout";
import { Chart } from "./chart/Chart";

export const SensorDataHandler = () => {
  const [values, setValues] = useState([]);
  const firstDataIndex = useRef(0);

  const handleAccDataChange = useCallback(event => {
    const buffer = event.target.value;
    const output = [
      buffer.getUint8(0), // axisX
      buffer.getUint8(1), // axisY
      buffer.getUint8(2) // axisZ
    ].map(calcAccFromSensorOutput);

    setValues(prevValues => {
      const newValues = [...prevValues, Math.hypot(...output)];
      if (newValues.length > 20) {
        newValues.shift();
        firstDataIndex.current++;
      }
      return newValues;
    });
  }, []);

  return (
    <Box width="100%" maxHeight="100%">
      <Chart data={values} firstIndex={firstDataIndex.current} />
      <BLEConfigHandler
        dataHandler={handleAccDataChange}
      />
    </Box>
  );
};
