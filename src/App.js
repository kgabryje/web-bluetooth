import React, {useState} from 'react';
import {SensorDataHandler} from "./SensorDataHandler";

export const AccUUIDsContext = React.createContext();
const ACC_UUIDS = {
    serviceUUID: 'f000aa10-0451-4000-b000-000000000000',
    dataCharUUID: 'f000aa11-0451-4000-b000-000000000000',
    configCharUUID: 'f000aa12-0451-4000-b000-000000000000',
};

const App = () => {
    const [accService, setAccService] = useState(undefined);

    const getService = serviceUUID => navigator.bluetooth.requestDevice({filters: [{services: [serviceUUID]}]})
        .then(device => device.gatt.connect())
        .then(server => server.getPrimaryService(serviceUUID))
        .then(service => {
            setAccService(service);
            return service;
        })
        .catch(err => console.log(err.message));

    return (
        <AccUUIDsContext.Provider value={ACC_UUIDS}>
            <div>
                <button onClick={() => getService(ACC_UUIDS.serviceUUID)}>Scan devices</button>
            </div>
            <SensorDataHandler service={accService}/>
        </AccUUIDsContext.Provider>
    );
};

export default App;
