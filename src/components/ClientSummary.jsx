import React from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiDownload, FiUser, FiMail, FiPhone, FiMapPin, FiHash, FiCode, FiCalendar } = FiIcons;

function ClientSummary({ client, onClose }) {
  const { state } = useReceipts();
  const { receipts, categories } = state;

  const clientReceipts = receipts.filter(receipt => receipt.clientId === client.id);
  const totalAmount = clientReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);

  // Group receipts by category
  const categoryBreakdown = categories.map(category => {
    const categoryReceipts = clientReceipts.filter(receipt => receipt.categoryId === category.id);
    const categoryTotal = categoryReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    return {
      ...category,
      receipts: categoryReceipts,
      total: categoryTotal,
      count: categoryReceipts.length
    };
  }).filter(category => category.count > 0);

  // Group receipts by month
  const monthlyBreakdown = clientReceipts.reduce((acc, receipt) => {
    const date = new Date(receipt.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { name: monthName, receipts: [], total: 0 };
    }
    acc[monthKey].receipts.push(receipt);
    acc[monthKey].total += receipt.amount || 0;
    return acc;
  }, {});

  const downloadSummary = () => {
    const summaryData = {
      client: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        taxId: client.taxId,
        projectCode: client.projectCode
      },
      summary: {
        totalReceipts: clientReceipts.length,
        totalAmount: totalAmount,
        averageAmount: clientReceipts.length > 0 ? totalAmount / clientReceipts.length : 0,
        dateRange: {
          earliest: clientReceipts.length > 0 ? Math.min(...clientReceipts.map(r => new Date(r.date).getTime())) : null,
          latest: clientReceipts.length > 0 ? Math.max(...clientReceipts.map(r => new Date(r.date).getTime())) : null
        }
      },
      categoryBreakdown: categoryBreakdown.map(cat => ({
        name: cat.name,
        count: cat.count,
        total: cat.total,
        percentage: totalAmount > 0 ? (cat.total / totalAmount * 100).toFixed(2) : 0
      })),
      monthlyBreakdown: Object.values(monthlyBreakdown).map(month => ({
        month: month.name,
        count: month.receipts.length,
        total: month.total
      })),
      receipts: clientReceipts.map(receipt => ({
        date: receipt.date,
        vendor: receipt.vendor,
        amount: receipt.amount,
        category: categories.find(cat => cat.id === receipt.categoryId)?.name || 'Uncategorized',
        description: receipt.description || '',
        tags: receipt.tags || []
      })),
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.name.replace(/\s+/g, '_')}_summary_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Vendor', 'Amount', 'Category', 'Description', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...clientReceipts.map(receipt => {
        const category = categories.find(cat => cat.id === receipt.categoryId);
        return [
          receipt.date,
          `"${receipt.vendor}"`,
          receipt.amount,
          `"${category?.name || 'Uncategorized'}"`,
          `"${receipt.description || ''}"`,
          `"${receipt.tags?.join(', ') || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.name.replace(/\s+/g, '_')}_receipts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4"
                style={{ backgroundColor: client.color }}
              >
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-500">Client Summary Report</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                CSV
              </button>
              <button
                onClick={downloadSummary}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                JSON
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <SafeIcon icon={FiUser} className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{client.name}</span>
              </div>
              {client.email && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{client.phone}</span>
                </div>
              )}
              {client.taxId && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiHash} className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Tax ID:</span>
                  <span className="ml-2 font-medium">{client.taxId}</span>
                </div>
              )}
              {client.projectCode && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiCode} className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Project Code:</span>
                  <span className="ml-2 font-medium">{client.projectCode}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-start text-sm col-span-2">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">Address:</span>
                  <span className="ml-2 font-medium">{client.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600">Total Receipts</div>
              <div className="text-2xl font-bold text-blue-900">{clientReceipts.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600">Total Amount</div>
              <div className="text-2xl font-bold text-green-900">${totalAmount.toFixed(2)}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600">Average Amount</div>
              <div className="text-2xl font-bold text-purple-900">
                ${clientReceipts.length > 0 ? (totalAmount / clientReceipts.length).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-orange-600">Categories</div>
              <div className="text-2xl font-bold text-orange-900">{categoryBreakdown.length}</div>
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryBreakdown.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categoryBreakdown.map((category) => (
                      <tr key={category.id}>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                            {category.name}
                          </div>
                        </td>
                        <td className="px-4 py-2">{category.count}</td>
                        <td className="px-4 py-2">${category.total.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          {totalAmount > 0 ? ((category.total / totalAmount) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Monthly Breakdown */}
          {Object.keys(monthlyBreakdown).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(monthlyBreakdown).map((month, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-900">{month.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {month.receipts.length} receipts • ${month.total.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Receipts */}
          {clientReceipts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Receipts</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientReceipts.slice(0, 10).map((receipt) => {
                      const category = categories.find(cat => cat.id === receipt.categoryId);
                      return (
                        <tr key={receipt.id}>
                          <td className="px-4 py-2 text-sm">{new Date(receipt.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-sm">{receipt.vendor}</td>
                          <td className="px-4 py-2 text-sm">${receipt.amount?.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">
                            {category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: category.color + '20', color: category.color }}
                              >
                                {category.name}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {clientReceipts.length > 10 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing 10 of {clientReceipts.length} receipts
                </p>
              )}
            </div>
          )}

          {clientReceipts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No receipts found for this client.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ClientSummary;