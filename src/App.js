import React, { useState, Suspense, lazy } from "react";
import { PoseGroup } from "react-pose";
import { SensorDataHandler } from "./components/SensorDataHandler";
import { FilledButton } from "./components/Button";
import { Container } from "./components/Layout";
const PoseContainer = lazy(() => import("./components/Appear"));

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

  const getService = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "SensorTag" }],
        optionalServices: [ACC_UUIDS.serviceUUID]
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(ACC_UUIDS.serviceUUID);

      setAccService(service);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const contextValue = {
    uuids: ACC_UUIDS,
    service: accService,
    setErrorMessage: setErrorMessage
  };

  return (
    <Suspense fallback={<div />}>
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
                <FilledButton onClick={getService}>
                  Find SensorTag
                </FilledButton>
              </PoseContainer>
            )}
          </PoseGroup>
          <p style={{ color: "#ff2500" }}>{errorMessage}</p>
        </Container>
      </SensorTagContext.Provider>
    </Suspense>
  );
};

export default App;
