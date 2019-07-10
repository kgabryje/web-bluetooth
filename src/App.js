import React, { useState } from "react";
import { PoseGroup } from "react-pose";
import { SensorDataHandler } from "./components/SensorDataHandler";
import { FilledButton } from "./components/Button";
import { Container } from "./components/Layout";
import { Appear } from "./components/Appear";
import { Spinner } from "./components/Spinner";

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
  const [showSpinner, setShowSpinner] = useState(false);

  const getService = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "SensorTag" }],
        optionalServices: [ACC_UUIDS.serviceUUID]
      });

      setShowSpinner(true);
      setErrorMessage("");

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(ACC_UUIDS.serviceUUID);

      setAccService(service);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setShowSpinner(false)
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
        id="ContentContainer"
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
            <Appear width="100%" key="chart">
              <SensorDataHandler />
            </Appear>
          ) : (
            <Appear key="search-button">
              {showSpinner ? (
                <Spinner />
              ) : (
                <FilledButton onClick={getService}>Find SensorTag</FilledButton>
              )}
            </Appear>
          )}
        </PoseGroup>
        <p style={{ color: "#ff2500" }}>{errorMessage}</p>
      </Container>
    </SensorTagContext.Provider>
  );
};

export default App;
