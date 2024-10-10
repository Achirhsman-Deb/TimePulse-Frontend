import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useSelector } from 'react-redux';

const SalesGraph = () => {
  const auth = useSelector(state => state.auth);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`/api/product/sales-data`, {
          headers: {
            Authorization: auth.token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setSalesData(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch sales data', error);
        setError('Failed to load sales data.');
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [auth.token]);

  const chartData = {
    labels: salesData?.map(sale => sale._id), // No "Day" prefix, just numbers
    datasets: [
      {
        label: 'Sales (in ₹)',
        data: salesData?.map(sale => sale.totalSales),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, '#34D399');  // Lighter green
          gradient.addColorStop(1, '#047857');  // Darker green
          return gradient;
        },
        borderColor: '#047857',
        borderWidth: 2,
        hoverBackgroundColor: '#065F46',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to grow responsively
    layout: {
      padding: {
        bottom: 30 // Increase this value to add more padding at the bottom
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#374151',
          font: {
            family: 'Inter, sans-serif',
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Sales: ₹${tooltipItem.raw}`;
          }
        },
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#4B5563',
          font: {
            family: 'Inter, sans-serif',
            weight: '500'
          }
        },
        grid: {
          color: '#D1D5DB'
        },
        title: {
          display: true,
          text: 'Total Sales (in ₹)',
          color: '#111827',
          font: {
            family: 'Inter, sans-serif',
            weight: '600',
            size: 14
          }
        }
      },
      x: {
        ticks: {
          color: '#4B5563',
          font: {
            family: 'Inter, sans-serif',
            weight: '500'
          }
        },
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Days of the Month',
          color: '#111827',
          font: {
            family: 'Inter, sans-serif',
            weight: '600',
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="md:p-8 bg-white shadow-xl rounded-lg w-full max-w-4xl mx-auto h-[300px] md:h-[400px] lg:h-[500px] overflow-x-auto overflow-y-hidden">
      <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-6 text-gray-800 text-center">Sales for the Month</h2>
      {loading ? (
        <p className="text-lg text-gray-500 text-center">Loading sales data...</p>
      ) : error ? (
        <p className="text-lg text-red-600 text-center">{error}</p>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default SalesGraph;
