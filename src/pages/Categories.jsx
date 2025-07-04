import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import CategoryCard from '../components/CategoryCard';
import CategoryForm from '../components/CategoryForm';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTag } = FiIcons;

function Categories() {
  const { state, dispatch } = useReceipts();
  const { categories, receipts } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = (categoryData) => {
    dispatch({ type: 'ADD_CATEGORY', payload: categoryData });
    setShowForm(false);
  };

  const handleUpdateCategory = (categoryData) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: categoryData });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    }
  };

  const getCategoryStats = (categoryId) => {
    const categoryReceipts = receipts.filter(receipt => receipt.categoryId === categoryId);
    const totalAmount = categoryReceipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    return {
      count: categoryReceipts.length,
      total: totalAmount
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const stats = getCategoryStats(category.id);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategoryCard
                category={category}
                stats={stats}
                onEdit={() => setEditingCategory(category)}
                onDelete={() => handleDeleteCategory(category.id)}
              />
            </motion.div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiTag} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No categories created yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Category
          </button>
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          onSubmit={handleAddCategory}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleUpdateCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}

export default Categories;