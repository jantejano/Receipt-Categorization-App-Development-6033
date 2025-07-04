import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useReceipts } from '../context/ReceiptContext';

function MonthlyTrends() {
  const { state } = useReceipts();
  const { receipts } = state;

  // Get last 6 months of data
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    last6Months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }

  const monthlyData = last6Months.map(monthInfo => {
    const monthExpenses = receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      return receiptDate.getMonth() === monthInfo.month && 
             receiptDate.getFullYear() === monthInfo.year;
    }).reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    
    return {
      month: monthInfo.label,
      amount: monthExpenses
    };
  });

  const option = {
    title: {
      text: 'Monthly Expense Trends',
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
      data: monthlyData.map(item => item.month),
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
        data: monthlyData.map(item => item.amount),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#3b82f6'
              },
              {
                offset: 1,
                color: '#1d4ed8'
              }
            ]
          }
        },
        barWidth: '60%'
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
        style={{ height: '350px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}

export default MonthlyTrends;