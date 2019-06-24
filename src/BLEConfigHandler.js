import React, { useContext, useMemo } from "react";
import { AccUUIDsContext } from "./App";

export const BLEConfigHandler = React.memo(
  ({ characteristicState, dataHandler }) => {
    const { uuids, service } = useContext(AccUUIDsContext);
    const {
      accDataCharacteristic,
      setAccDataCharacteristic
    } = characteristicState;

    const stopNotifications = () => {
      const characteristic = accDataCharacteristic.characteristic;
      if (accDataCharacteristic.characteristic) {
        characteristic
          .stopNotifications()
          .then(() => {
            characteristic.removeEventListener(
              "characteristicvaluechanged",
              dataHandler
            );
            setAccDataCharacteristic(prevChar => ({
              ...prevChar,
              isNotifying: false
            }));
          })
          .catch(error => {
            console.log(error);
          });
      }
    };

    const startNotifications = () => {
      const characteristic = accDataCharacteristic.characteristic;
      characteristic
        .startNotifications()
        .then(() => {
          characteristic.addEventListener(
            "characteristicvaluechanged",
            dataHandler
          );
          setAccDataCharacteristic(prevChar => ({
            ...prevChar,
            isNotifying: true
          }));
        })
        .catch(error => {
          console.log(error);
        });
    };

    useMemo(() => {
      service &&
        service
          .getCharacteristic(uuids.configCharUUID)
          .then(configCharacteristic =>
            configCharacteristic.writeValue(Uint8Array.of(1))
          ) // enable acc sensor
          .then(() =>
            service
              .getCharacteristic(uuids.dataCharUUID) // read acc sensor output
              .then(dataCharacteristic =>
                dataCharacteristic.startNotifications().then(() => {
                  dataCharacteristic.addEventListener(
                    "characteristicvaluechanged",
                    dataHandler
                  );
                  setAccDataCharacteristic({
                    characteristic: dataCharacteristic,
                    isNotifying: true
                  });
                })
              )
              .catch(err => console.log(err.message))
          )
          .catch(err => console.log(err.message));
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
