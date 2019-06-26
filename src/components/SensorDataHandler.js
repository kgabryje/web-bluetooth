import React, { useState, useCallback, useRef, lazy } from "react";
import { calcAccFromSensorOutput } from "../helpers";
import { BLEConfigHandler } from "./BLEConfigHandler";
import { Box } from "./Layout";
const Chart = lazy(() => import("./chart/Chart"));

export const SensorDataHandler = () => {
  const [accDataCharacteristic, setAccDataCharacteristic] = useState({
    characteristic: null,
    isNotifying: false
  });
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
        characteristicState={{
          accDataCharacteristic,
          setAccDataCharacteristic
        }}
        dataHandler={handleAccDataChange}
      />
    </Box>
  );
};
