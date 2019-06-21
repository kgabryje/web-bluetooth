import React, {useContext, useEffect, useState} from "react";
import {AccUUIDsContext} from "./App";
import {Chart} from "./Chart";

const calcAccFromSensorOutput = val => val > 127 ? (val - 256) / 64 : val / 64;

export const SensorDataHandler = ({service}) => {
    const accUUIDS = useContext(AccUUIDsContext);
    const [currentAcc, setCurrentAcc] = useState(0);

    const handleAccDataChange = event => {
        const buffer = event.target.value;
        const output = [buffer.getUint8(0), buffer.getUint8(1), buffer.getUint8(2)]
            .map(calcAccFromSensorOutput);
        const acc = Math.hypot(...output);
        setCurrentAcc(acc);
    };

    useEffect(() => {
            service && service.getCharacteristic(accUUIDS.configCharUUID)
                .then(configCharacteristic => configCharacteristic.writeValue(Uint8Array.of(1))) // enable acc sensor
                .then(
                    () => service.getCharacteristic(accUUIDS.dataCharUUID) // read acc sensor output
                        .then(dataCharacteristic => dataCharacteristic.startNotifications())
                        .then(dataCharacteristic => dataCharacteristic.addEventListener(
                            'characteristicvaluechanged',
                            handleAccDataChange
                        ))
                        .catch(err => console.log(err.message))
                )
                .catch(err => console.log(err.message));
        }, [service, accUUIDS]
    );

    return <Chart data={currentAcc}/>
};