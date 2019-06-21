import React, {useState, useEffect, useRef} from "react"
import CanvasJSReact from "./canvasjs.react"
const CanvasChart = CanvasJSReact.CanvasJSChart;

export const Chart = ({data}) => {
    const chartRef = useRef(null);
    const [dataPoints, setDataPoints] = useState([]);
    const [dataIndex, setDataIndex] = useState(0);

    const updateChart = value => {
        const point = {x: dataIndex, y: value};

        setDataPoints(prevDataPoints => {
            const points = [...prevDataPoints, point];
            if (points.length > 20) {
                points.shift();
            }
            return points;
        });
        setDataIndex(prevDataIndex => prevDataIndex + 1);
        chartRef.current.render()
    };

    useEffect(() => {
        if (chartRef && chartRef.current) {
            updateChart(data);
        }
    }, [data]);

    const options = {
        title: {
            text: "Accelerometer data"
        },
        data: [{
            type: "line",
            dataPoints: dataPoints
        }]
    };
    return (<CanvasChart ref={chartRef} options={options}/>);
};