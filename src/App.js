import React, { useState } from "react";
import { SensorDataHandler } from "./SensorDataHandler";

export const AccUUIDsContext = React.createContext({
  uuids: {
    serviceUUID: "000000",
    dataCharUUID: "000000",
    configCharUUID: "000000"
  },
  service: null
});

const ACC_UUIDS = {
  serviceUUID: "f000aa10-0451-4000-b000-000000000000",
  dataCharUUID: "f000aa11-0451-4000-b000-000000000000",
  configCharUUID: "f000aa12-0451-4000-b000-000000000000"
};

const App = () => {
  const [accService, setAccService] = useState(null);

  const getService = async serviceUUID => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUUID] }]
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUUID);

      setAccService(service);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AccUUIDsContext.Provider value={{ uuids: ACC_UUIDS, service: accService }}>
      <button onClick={() => getService(ACC_UUIDS.serviceUUID)}>
        Scan devices
      </button>
      <SensorDataHandler />
    </AccUUIDsContext.Provider>
  );
};

export default App;
