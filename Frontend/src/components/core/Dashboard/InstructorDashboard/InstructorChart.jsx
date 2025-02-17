import React, { useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    const [currChart, setCurrChart] = useState('students');

    // Handle null or undefined courses
    if (!courses || courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-richblack-700 rounded-lg">
                <p className="text-richblack-200">No data available to display.</p>
            </div>
        );
    }

    const generateRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)})`;
            colors.push(color);
        }
        return colors;
    };

    const chartDataStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: generateRandomColors(courses.length),
            },
        ],
    };

    const chartIncomeData = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: generateRandomColors(courses.length),
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                top: 20,    // Add space above the chart
                bottom: 20, // Add space below the chart
                left: 20,   // Add space to the left of the chart
                right: 20,  // Add space to the right of the chart
            },
        },
        plugins: {
            legend: {
                position: 'bottom', // Position the legend at the bottom
                labels: {
                    color: '#fff', // Legend text color
                    padding: 20,   // Add space between legend items
                    boxWidth: 20,  // Width of the color block
                    boxHeight: 20,  // Height of the color block
                    font: {
                        size: 12,  // Font size of the legend
                    },
                },
            },
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setCurrChart('students')}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        currChart === 'students'
                            ? 'bg-yellow-100 text-richblack-900'
                            : 'bg-richblack-600 text-richblack-200 hover:bg-richblack-500'
                    }`}
                >
                    Students
                </button>
                <button
                    onClick={() => setCurrChart('income')}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        currChart === 'income'
                            ? 'bg-yellow-100 text-richblack-900'
                            : 'bg-richblack-600 text-richblack-200 hover:bg-richblack-500'
                    }`}
                >
                    Income
                </button>
            </div>
            <div className="relative h-96 w-full">
                <Pie
                    data={currChart === 'students' ? chartDataStudents : chartIncomeData}
                    options={options}
                />
            </div>
        </div>
    );
};

export default InstructorChart;