import React, { useState } from "react";
import { PoseGroup } from "react-pose";
import { SensorDataHandler } from "./components/SensorDataHandler";
import { FilledButton } from "./components/Button";
import { Container } from "./components/Layout";
import { PoseContainer } from "./components/Appear";

export const SensorTagContext = React.createContext({
  uuids: {},
  service: {},
  setErrorMessage: () => {}
});

const ACC_UUIDS = {
  serviceUUID: "f000aa10-0451-4000-b000-000000000000",
  dataCharUUID: "f000aa11-0451-4000-b000-000000000000",
  configCharUUID: "f000aa12-0451-4000-b000-000000000000"
};

const App = () => {
  const [accService, setAccService] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getService = async serviceUUID => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUUID] }]
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUUID);

      setAccService(service);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };

  const contextValue = {
    uuids: ACC_UUIDS,
    service: accService,
    setErrorMessage: setErrorMessage
  };

  return (
    <SensorTagContext.Provider value={contextValue}>
      <Container
        position="absolute"
        justifyContent="center"
        alignItems="center"
        top={0}
        bottom={0}
        left={0}
        right={0}
      >
        <PoseGroup>
          {accService ? (
            <PoseContainer width="100%" key="chart">
              <SensorDataHandler />
            </PoseContainer>
          ) : (
            <PoseContainer key="search-button">
              <FilledButton onClick={() => getService(ACC_UUIDS.serviceUUID)}>
                Find SensorTag
              </FilledButton>
            </PoseContainer>
          )}
        </PoseGroup>
        {errorMessage}
      </Container>
    </SensorTagContext.Provider>
  );
};

export default App;
