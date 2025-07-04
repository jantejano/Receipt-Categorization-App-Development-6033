import React, {useState} from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiDatabase, FiTrash2, FiDownload, FiFolder, FiFile, FiImage, FiFileText, FiArchive, FiAlertTriangle, FiRefreshCw} = FiIcons;

function StorageManagement({currentPlan, usage, onUpgrade}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCleanup, setShowCleanup] = useState(false);

  const storageUsed = usage?.storageUsed || 0;
  const storageLimit = currentPlan?.limits?.storageBytes || 0;
  const storagePercentage = storageLimit > 0 ? Math.round((storageUsed / storageLimit) * 100) : 0;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mock storage breakdown data
  const storageBreakdown = [
    {
      type: 'receipt_images',
      name: 'Receipt Images',
      size: storageUsed * 0.6, // 60% of storage
      count: 1247,
      icon: FiImage,
      color: 'blue'
    },
    {
      type: 'document_attachments',
      name: 'Document Attachments',
      size: storageUsed * 0.25, // 25% of storage
      count: 156,
      icon: FiFileText,
      color: 'green'
    },
    {
      type: 'export_files',
      name: 'Export Files',
      size: storageUsed * 0.1, // 10% of storage
      count: 23,
      icon: FiDownload,
      color: 'purple'
    },
    {
      type: 'backup_data',
      name: 'Backup Data',
      size: storageUsed * 0.05, // 5% of storage
      count: 12,
      icon: FiArchive,
      color: 'orange'
    }
  ];

  // Mock large files that can be cleaned up
  const largeFiles = [
    {
      id: 'file_1',
      name: 'Annual_Report_2023_Backup.pdf',
      size: 45 * 1024 * 1024, // 45MB
      type: 'backup',
      lastAccessed: '2023-12-15',
      canDelete: true
    },
    {
      id: 'file_2',
      name: 'Receipt_Images_Archive_Q1.zip',
      size: 120 * 1024 * 1024, // 120MB
      type: 'archive',
      lastAccessed: '2024-01-10',
      canDelete: true
    },
    {
      id: 'file_3',
      name: 'Export_All_Data_Jan2024.json',
      size: 25 * 1024 * 1024, // 25MB
      type: 'export',
      lastAccessed: '2024-01-20',
      canDelete: true
    }
  ];

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected files? This action cannot be undone.`)) {
      // Simulate file deletion
      const deletedSize = largeFiles
        .filter(file => selectedItems.includes(file.id))
        .reduce((total, file) => total + file.size, 0);
      
      alert(`Successfully deleted ${formatBytes(deletedSize)} of storage space.`);
      setSelectedItems([]);
    }
  };

  const handleOptimizeStorage = () => {
    if (window.confirm('This will compress old receipt images and remove temporary files. Continue?')) {
      // Simulate storage optimization
      setTimeout(() => {
        alert('Storage optimization complete! Freed up 2.3 GB of space.');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SafeIcon icon={FiDatabase} className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-purple-900">Storage Usage</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-900">{formatBytes(storageUsed)}</p>
            <p className="text-sm text-purple-600">of {currentPlan?.limits?.storage}</p>
          </div>
        </div>
        
        <div className="w-full bg-purple-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              storagePercentage >= 90 ? 'bg-red-500' : 
              storagePercentage >= 75 ? 'bg-yellow-500' : 'bg-purple-500'
            }`}
            style={{width: `${Math.min(storagePercentage, 100)}%`}}
          />
        </div>
        
        <div className="flex justify-between text-sm text-purple-700">
          <span>{storagePercentage}% used</span>
          <span>{formatBytes(storageLimit - storageUsed)} available</span>
        </div>

        {storagePercentage >= 80 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  You're running low on storage space.
                </p>
              </div>
              <button
                onClick={onUpgrade}
                className="text-yellow-800 hover:text-yellow-900 font-medium text-sm"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Storage Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Storage Breakdown</h3>
        
        <div className="space-y-4">
          {storageBreakdown.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{opacity: 0, x: -20}}
              animate={{opacity: 1, x: 0}}
              transition={{delay: index * 0.1}}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                  <SafeIcon icon={item.icon} className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.count} files</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatBytes(item.size)}</p>
                <p className="text-sm text-gray-500">
                  {Math.round((item.size / storageUsed) * 100)}% of total
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Storage Cleanup Tools */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Storage Cleanup</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOptimizeStorage}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Optimize Storage
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Review and clean up large files to free up storage space. Old exports and backups can usually be safely deleted.
          </p>
        </div>

        {/* Large Files List */}
        <div className="space-y-3">
          {largeFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(file.id)}
                  onChange={() => handleSelectItem(file.id)}
                  className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <SafeIcon icon={FiFile} className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">{file.name}</h4>
                    <p className="text-sm text-gray-500">
                      Last accessed: {new Date(file.lastAccessed).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">{formatBytes(file.size)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  file.type === 'backup' ? 'bg-orange-100 text-orange-800' :
                  file.type === 'archive' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {file.type}
                </span>
                {file.canDelete && (
                  <button
                    onClick={() => handleSelectItem(file.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {largeFiles.length === 0 && (
          <div className="text-center py-8">
            <SafeIcon icon={FiFolder} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No large files found for cleanup</p>
          </div>
        )}
      </div>

      {/* Storage Tips */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Management Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <SafeIcon icon={FiImage} className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Image Optimization</h4>
                <p className="text-sm text-gray-600">Enable automatic image compression to reduce storage usage without losing quality.</p>
              </div>
            </div>
            <div className="flex items-start">
              <SafeIcon icon={FiArchive} className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Archive Old Data</h4>
                <p className="text-sm text-gray-600">Archive receipts older than 7 years to free up space while maintaining compliance.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <SafeIcon icon={FiDownload} className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Regular Exports</h4>
                <p className="text-sm text-gray-600">Export data regularly and delete old export files to keep storage clean.</p>
              </div>
            </div>
            <div className="flex items-start">
              <SafeIcon icon={FiTrash2} className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Delete Duplicates</h4>
                <p className="text-sm text-gray-600">Use our duplicate detection tool to find and remove duplicate receipts automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorageManagement;