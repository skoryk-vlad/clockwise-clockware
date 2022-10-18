import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const borderColor = 'rgb(253, 186, 18)';
const backgroundColor = 'rgba(255, 206, 86, 0.7)';

const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true
        },
    }
};

export const LineChart = ({ label, labels, data }) => {
    const lineData = {
        labels,
        datasets: [
            {
                fill: true,
                label,
                data,
                borderColor,
                backgroundColor
            },
        ],
    };

    return (
        <Line data={lineData} options={options} />
    )
}
