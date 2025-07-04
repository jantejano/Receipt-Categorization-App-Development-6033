import React from 'react';
import { Link } from 'react-router-dom';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiCalendar, FiDollarSign } = FiIcons;

function RecentReceipts() {
  const { state } = useReceipts();
  const { receipts, categories } = state;

  const recentReceipts = receipts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getCategory = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Receipts</h3>
          <Link
            to="/receipts"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            View All
            <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recentReceipts.length > 0 ? (
          recentReceipts.map((receipt) => {
            const category = getCategory(receipt.categoryId);
            return (
              <div key={receipt.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {receipt.image ? (
                        <img
                          src={receipt.image}
                          alt="Receipt"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <SafeIcon icon={FiCalendar} className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {receipt.vendor}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(receipt.date).toLocaleDateString()}
                      </p>
                      {category && (
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
                          style={{
                            backgroundColor: category.color + '20',
                            color: category.color
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-1" />
                      {receipt.amount?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No receipts yet. Add your first receipt to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentReceipts;