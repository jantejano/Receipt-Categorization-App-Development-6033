import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useReceipts } from '../context/ReceiptContext';

function ExpenseChart({ receipts: propReceipts }) {
  const { state } = useReceipts();
  const receipts = propReceipts || state.receipts;

  // Get last 7 days of data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split('T')[0]);
  }

  const dailyExpenses = last7Days.map(date => {
    const dayExpenses = receipts.filter(receipt => 
      receipt.date === date
    ).reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: dayExpenses
    };
  });

  const option = {
    title: {
      text: 'Daily Expenses (Last 7 Days)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>$${data.value.toFixed(2)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: dailyExpenses.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280',
        formatter: '${value}'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        data: dailyExpenses.map(item => item.amount),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(59, 130, 246, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(59, 130, 246, 0.05)'
              }
            ]
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  return (
    <div className="chart-container">
      <ReactECharts
        option={option}
        style={{ height: '300px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}

export default ExpenseChart;