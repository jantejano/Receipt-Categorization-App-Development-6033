import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useReceipts } from '../context/ReceiptContext';

function CategoryBreakdown({ receipts: propReceipts }) {
  const { state } = useReceipts();
  const { categories } = state;
  const receipts = propReceipts || state.receipts;

  const categoryData = categories.map(category => {
    const categoryReceipts = receipts.filter(receipt => receipt.categoryId === category.id);
    const total = categoryReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    
    return {
      name: category.name,
      value: total,
      itemStyle: {
        color: category.color
      }
    };
  }).filter(item => item.value > 0);

  const option = {
    title: {
      text: 'Expenses by Category',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: categoryData
      }
    ]
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

export default CategoryBreakdown;