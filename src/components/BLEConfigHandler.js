import React, { lazy, useContext, useMemo } from "react";
import { SensorTagContext } from "../App";
import { FilledButton } from "./Button";
import { Flex } from "./Layout";
const PoseContainer = lazy(() => import("./Appear"));

export const BLEConfigHandler = React.memo(
  ({ characteristicState, dataHandler }) => {
    const { uuids, service, setErrorMessage } = useContext(SensorTagContext);
    const {
      accDataCharacteristic,
      setAccDataCharacteristic
    } = characteristicState;

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
        console.log("dupa " + error.message);
        setErrorMessage(error.message);
      }
    }, [
      service,
      uuids,
      dataHandler,
      setAccDataCharacteristic,
      setErrorMessage
    ]);

    return (
      <Flex justifyContent="center" mt="100px">
        {service && accDataCharacteristic.characteristic && (
          <PoseContainer>
            {accDataCharacteristic.isNotifying ? (
              <FilledButton onClick={stopNotifications}>
                Stop reading data
              </FilledButton>
            ) : (
              <FilledButton onClick={resumeNotifications}>
                Start reading data
              </FilledButton>
            )}
          </PoseContainer>
        )}
      </Flex>
    );
  }
);
