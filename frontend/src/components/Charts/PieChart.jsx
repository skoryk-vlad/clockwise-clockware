import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const backgroundColor = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
];
const hoverBackgroundColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
];

const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
];

const options = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
        padding: {
            bottom: 15
        }
    },
    plugins: {
        legend: {
            display: true
        },
    },
};

export const PieChart = ({ label, labels, data }) => {
    const pieData = {
        labels,
        datasets: [
            {
                label,
                data,
                backgroundColor,
                borderColor,
                borderWidth: 3,
                borderAlign: "inner",
                hoverBackgroundColor,
                hoverBorderWidth: 1,
                hoverOffset: 15
            },
        ]
    };

    return (
        <Pie data={pieData} options={options} />
    )
}
