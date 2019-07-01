import React, { useState, useContext, useMemo } from "react";
import { SensorTagContext } from "../App";
import { FilledButton } from "./Button";
import { Flex } from "./Layout";
import { Appear } from "./Appear";

export const BLEConfigHandler = React.memo(({ dataHandler }) => {
  const [accDataCharacteristic, setAccDataCharacteristic] = useState({
    characteristic: null,
    isNotifying: false
  });
  const { uuids, service, setErrorMessage } = useContext(SensorTagContext);

  const stopNotifications = async () => {
    const characteristic = accDataCharacteristic.characteristic;
    if (!characteristic) {
      return;
    }
    try {
      await characteristic.stopNotifications();
      characteristic.removeEventListener(
        "characteristicvaluechanged",
        dataHandler
      );

      setAccDataCharacteristic(prevChar => ({
        ...prevChar,
        isNotifying: false
      }));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const resumeNotifications = async () => {
    const characteristic = accDataCharacteristic.characteristic;
    if (!characteristic) {
      return;
    }
    try {
      await characteristic.startNotifications();
      characteristic.addEventListener(
        "characteristicvaluechanged",
        dataHandler
      );
      setAccDataCharacteristic(prevChar => ({
        ...prevChar,
        isNotifying: true
      }));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useMemo(async () => {
    if (!service) {
      return;
    }

    try {
      const configCharacteristic = await service.getCharacteristic(
        uuids.configCharUUID
      );
      await configCharacteristic.writeValue(Uint8Array.of(1)); // enable acc sensor

      const dataCharacteristic = await service.getCharacteristic(
        uuids.dataCharUUID
      ); // read acc sensor output
      await dataCharacteristic.startNotifications();
      dataCharacteristic.addEventListener(
        "characteristicvaluechanged",
        dataHandler
      );

      setAccDataCharacteristic({
        characteristic: dataCharacteristic,
        isNotifying: true
      });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [service, uuids, dataHandler, setErrorMessage]);

  return (
    <Flex justifyContent="center" mt="100px">
      {service && accDataCharacteristic.characteristic && (
        <Appear>
          {accDataCharacteristic.isNotifying ? (
            <FilledButton onClick={stopNotifications}>
              Stop reading data
            </FilledButton>
          ) : (
            <FilledButton onClick={resumeNotifications}>
              Start reading data
            </FilledButton>
          )}
        </Appear>
      )}
    </Flex>
  );
});
