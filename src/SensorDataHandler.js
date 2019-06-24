import React, { useState, useCallback, useRef } from "react";
import { calcAccFromSensorOutput } from "./helpers";
import { Chart } from "./Chart";
import { BLEConfigHandler } from "./BLEConfigHandler";

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
      buffer.getUint8(0),
      buffer.getUint8(1),
      buffer.getUint8(2)
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
    <div>
      <Chart data={values} firstIndex={firstDataIndex.current} />
      <BLEConfigHandler
        characteristicState={{
          accDataCharacteristic,
          setAccDataCharacteristic
        }}
        dataHandler={handleAccDataChange}
      />
    </div>
  );
};
