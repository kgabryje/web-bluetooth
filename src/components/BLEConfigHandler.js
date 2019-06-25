import React, { useContext, useMemo } from "react";
import { SensorTagContext } from "../App";
import { FilledButton } from "./Button";
import { PoseContainer } from "./Appear";
import { Flex } from "./Layout";

export const BLEConfigHandler = React.memo(
  ({ characteristicState, dataHandler }) => {
    const context = useContext(SensorTagContext);
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
        context.setErrorMessage("");
      } catch (error) {
        context.setErrorMessage(error.message);
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
        context.setErrorMessage("");
      } catch (error) {
        context.setErrorMessage(error.message);
      }
    };

    useMemo(async () => {
      if (!context.service) {
        return;
      }

      try {
        const configCharacteristic = await context.service.getCharacteristic(
          context.uuids.configCharUUID
        );
        await configCharacteristic.writeValue(Uint8Array.of(1)); // enable acc sensor

        const dataCharacteristic = await context.service.getCharacteristic(
          context.uuids.dataCharUUID
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
        context.setErrorMessage("");
      } catch (error) {
        context.setErrorMessage(error.message);
      }
    }, [context, dataHandler, setAccDataCharacteristic]);

    return (
      <Flex justifyContent="center" mt="100px">
        {context.service && accDataCharacteristic.characteristic && (
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
