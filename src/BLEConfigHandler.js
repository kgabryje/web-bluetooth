import React, { useContext, useMemo } from "react";
import { AccUUIDsContext } from "./App";

export const BLEConfigHandler = React.memo(
  ({ characteristicState, dataHandler }) => {
    const { uuids, service } = useContext(AccUUIDsContext);
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
      } catch (error) {
        console.log(error);
      }
    };

    const startNotifications = async () => {
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
      } catch (error) {
        console.log(error);
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
      } catch (error) {
        console.log(error);
      }
    }, [
      dataHandler,
      service,
      setAccDataCharacteristic,
      uuids.configCharUUID,
      uuids.dataCharUUID
    ]);

    return (
      <React.Fragment>
        {service &&
          accDataCharacteristic.characteristic &&
          (accDataCharacteristic.isNotifying ? (
            <button onClick={stopNotifications}>Stop reading data</button>
          ) : (
            <button onClick={startNotifications}>Start reading data</button>
          ))}
      </React.Fragment>
    );
  }
);
