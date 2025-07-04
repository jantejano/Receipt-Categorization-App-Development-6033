import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReceipts } from '../context/ReceiptContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const { FiX, FiUpload, FiFileText, FiDatabase, FiCheck, FiAlertTriangle, FiUser } = FiIcons;

function BulkImport({ onClose }) {
  const { state, dispatch } = useReceipts();
  const { categories, clients } = state;
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});
  const [selectedClient, setSelectedClient] = useState(''); // New state for client dropdown
  const [step, setStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (uploadedFile) => {
    if (!uploadedFile) return;

    setError(null);
    setIsProcessing(true);
    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Validate file type
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      setIsProcessing(false);
      return;
    }

    // Validate file size
    if (uploadedFile.size > maxSize) {
      setError('File size must be less than 10MB');
      setIsProcessing(false);
      return;
    }

    setFile(uploadedFile);
    parseFile(uploadedFile);
  };

  const parseFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();

    try {
      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => String(header || '').trim(),
          complete: (results) => {
            console.log('CSV parsed:', results);
            if (results.errors && results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }

            if (results.data && results.data.length > 0) {
              const cleanedData = results.data.filter(row =>
                Object.values(row).some(val => String(val || '').trim() !== '')
              );
              setParsedData(cleanedData);
              analyzeData(cleanedData);
              setStep(2);
            } else {
              setError('No data found in the CSV file');
            }
            setIsProcessing(false);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setError('Error parsing CSV file: ' + String(error.message || error));
            setIsProcessing(false);
          }
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              setError('No sheets found in the Excel file');
              setIsProcessing(false);
              return;
            }

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: '',
              blankrows: false
            });

            console.log('Excel parsed (raw):', jsonData);

            if (jsonData.length < 2) {
              setError('Excel file must have at least a header row and one data row');
              setIsProcessing(false);
              return;
            }

            // Convert to object format
            const headers = jsonData[0].map(h => String(h || '').trim()).filter(h => h);
            if (headers.length === 0) {
              setError('No valid headers found in the Excel file');
              setIsProcessing(false);
              return;
            }

            const dataRows = jsonData.slice(1).map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] !== undefined ? String(row[index] || '').trim() : '';
              });
              return obj;
            }).filter(row => Object.values(row).some(val => String(val || '').trim() !== ''));

            console.log('Excel parsed (objects):', dataRows);

            if (dataRows.length === 0) {
              setError('No data rows found in the Excel file');
              setIsProcessing(false);
              return;
            }

            setParsedData(dataRows);
            analyzeData(dataRows);
            setStep(2);
            setIsProcessing(false);
          } catch (error) {
            console.error('Excel parsing error:', error);
            setError('Error parsing Excel file: ' + String(error.message || error));
            setIsProcessing(false);
          }
        };

        reader.onerror = () => {
          setError('Error reading file');
          setIsProcessing(false);
        };

        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('File parsing error:', error);
      setError('Error processing file: ' + String(error.message || error));
      setIsProcessing(false);
    }
  };

  const analyzeData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      setError('No valid data to analyze');
      return;
    }

    try {
      console.log('Analyzing data:', data);
      const columns = Object.keys(data[0] || {}).filter(col => col && String(col).trim() !== '');
      if (columns.length === 0) {
        setError('No valid columns found in the data');
        return;
      }

      const analysis = {
        totalRows: data.length,
        columns: columns,
        columnAnalysis: {},
        suggestedMapping: {},
        categorySuggestions: {},
        summary: {}
      };

      // Analyze each column
      columns.forEach(col => {
        const values = data.map(row => row[col]).filter(val => val != null && String(val).trim() !== '');
        const sampleValues = values.slice(0, 10);

        analysis.columnAnalysis[col] = {
          sampleValues,
          totalValues: values.length,
          uniqueValues: new Set(values).size
        };

        // Smart column mapping
        const colLower = String(col).toLowerCase();
        if (colLower.includes('date') || colLower.includes('time')) {
          analysis.suggestedMapping.date = col;
        } else if (colLower.includes('amount') || colLower.includes('total') || colLower.includes('price') || colLower.includes('cost')) {
          analysis.suggestedMapping.amount = col;
        } else if (colLower.includes('vendor') || colLower.includes('merchant') || colLower.includes('store') || colLower.includes('company') || colLower.includes('supplier')) {
          analysis.suggestedMapping.vendor = col;
        } else if (colLower.includes('description') || colLower.includes('memo') || colLower.includes('note') || colLower.includes('detail')) {
          analysis.suggestedMapping.description = col;
        } else if (colLower.includes('category') || colLower.includes('type')) {
          analysis.suggestedMapping.category = col;
        }
      });

      // Auto-categorize based on vendor/description
      const categoryCounts = {};
      data.forEach(row => {
        const vendor = String(row[analysis.suggestedMapping.vendor] || '');
        const description = String(row[analysis.suggestedMapping.description] || '');
        const text = `${vendor} ${description}`.toLowerCase();
        const suggestedCategory = smartCategorize(text);
        if (suggestedCategory) {
          categoryCounts[suggestedCategory.name] = (categoryCounts[suggestedCategory.name] || 0) + 1;
        }
      });

      analysis.categorySuggestions = categoryCounts;

      // Calculate summary statistics
      if (analysis.suggestedMapping.amount) {
        const amounts = data
          .map(row => {
            const amountStr = String(row[analysis.suggestedMapping.amount] || '').replace(/[^0-9.-]/g, '');
            return parseFloat(amountStr);
          })
          .filter(amount => !isNaN(amount) && amount > 0);

        if (amounts.length > 0) {
          analysis.summary = {
            totalAmount: amounts.reduce((sum, amount) => sum + amount, 0),
            averageAmount: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length,
            minAmount: Math.min(...amounts),
            maxAmount: Math.max(...amounts),
            transactionCount: amounts.length
          };
        }
      }

      console.log('Analysis results:', analysis);
      setAnalysisResults(analysis);
      setColumnMapping(analysis.suggestedMapping);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Error analyzing data: ' + String(error.message || error));
    }
  };

  const smartCategorize = (text) => {
    try {
      const keywords = {
        'Gas & Fuel': ['gas', 'fuel', 'shell', 'exxon', 'chevron', 'bp', 'mobil', 'station', 'petrol'],
        'Transportation': ['uber', 'lyft', 'taxi', 'bus', 'train', 'subway', 'parking', 'toll', 'transport'],
        'Office Supplies': ['office', 'supplies', 'staples', 'depot', 'paper', 'pen', 'printer', 'stationery'],
        'Meals & Entertainment': ['restaurant', 'cafe', 'coffee', 'food', 'dining', 'lunch', 'dinner', 'starbucks', 'mcdonalds', 'pizza'],
        'Travel': ['hotel', 'flight', 'airline', 'booking', 'expedia', 'travel', 'airbnb', 'accommodation'],
        'Utilities': ['electric', 'water', 'gas bill', 'internet', 'phone', 'utility', 'electricity'],
        'Marketing': ['marketing', 'advertising', 'promotion', 'social media', 'google ads', 'facebook'],
        'Professional Services': ['consulting', 'legal', 'accounting', 'professional', 'service', 'lawyer'],
        'Equipment': ['equipment', 'computer', 'software', 'hardware', 'tool', 'machinery', 'laptop']
      };

      for (const [category, categoryKeywords] of Object.entries(keywords)) {
        if (categoryKeywords.some(keyword => text.includes(keyword))) {
          return categories.find(cat => cat.name === category);
        }
      }

      return categories.find(cat => cat.name === 'Other');
    } catch (error) {
      console.warn('Error in smart categorize:', error);
      return categories.find(cat => cat.name === 'Other');
    }
  };

  const handleColumnMappingChange = (field, column) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: column
    }));
  };

  const processImport = () => {
    try {
      const processedReceipts = parsedData.map((row, index) => {
        const vendor = String(row[columnMapping.vendor] || 'Unknown Vendor');
        const amountStr = String(row[columnMapping.amount] || '0').replace(/[^0-9.-]/g, '');
        const amount = parseFloat(amountStr) || 0;

        let date = new Date().toISOString().split('T')[0];
        if (row[columnMapping.date]) {
          try {
            const parsedDate = new Date(row[columnMapping.date]);
            if (!isNaN(parsedDate.getTime())) {
              date = parsedDate.toISOString().split('T')[0];
            }
          } catch (e) {
            console.warn('Invalid date format:', row[columnMapping.date]);
          }
        }

        // Extract description from the mapped column
        const description = columnMapping.description ? String(row[columnMapping.description] || '') : '';
        
        // Use selected client from dropdown
        const clientId = selectedClient ? parseInt(selectedClient) : null;

        // Smart categorization
        const text = `${vendor} ${description}`.toLowerCase();
        const suggestedCategory = smartCategorize(text);

        return {
          id: Date.now() + index + Math.random(),
          vendor,
          amount,
          date,
          description,
          categoryId: suggestedCategory?.id || categories.find(cat => cat.name === 'Other')?.id,
          clientId: clientId,
          createdAt: new Date().toISOString(),
          status: 'imported',
          tags: ['bulk-import']
        };
      });

      // Add all receipts to the store
      processedReceipts.forEach(receipt => {
        dispatch({ type: 'ADD_RECEIPT', payload: receipt });
      });

      const selectedClientName = selectedClient ? clients.find(c => c.id === parseInt(selectedClient))?.name : 'No client';
      alert(`Successfully imported ${processedReceipts.length} receipts${selectedClient ? ` for ${selectedClientName}` : ''}!`);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      setError('Error importing data: ' + String(error.message || error));
    }
  };

  const requiredFields = ['vendor', 'amount', 'date'];
  const canProceed = requiredFields.every(field => columnMapping[field]);

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
            <h3 className="text-lg font-semibold text-gray-900">Bulk Import Expenses</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center mt-4 space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2">Upload File</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 2 ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2">Map & Review</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Your Expense Data</h4>
                <p className="text-gray-600 mb-6">
                  Upload a CSV or Excel file containing your expense data. We'll automatically analyze and categorize it.
                </p>
              </div>

              {/* File Upload Area */}
              <div
                className={`file-upload-area p-12 text-center border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isProcessing && document.getElementById('bulk-file-upload')?.click()}
              >
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-lg font-medium text-gray-900">Processing file...</p>
                  </div>
                ) : (
                  <>
                    <SafeIcon icon={FiUpload} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-gray-500">
                        Supports CSV, XLSX, and XLS files up to 10MB
                      </p>
                    </div>
                  </>
                )}

                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  className="hidden"
                  id="bulk-file-upload"
                  disabled={isProcessing}
                />

                {!isProcessing && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      <SafeIcon icon={FiFileText} className="w-5 h-5 mr-2" />
                      Choose File
                    </span>
                  </div>
                )}
              </div>

              {file && !isProcessing && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700">
                      File selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}

              {/* Sample Format */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Expected File Format:</h5>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Your file should contain columns such as:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Date:</strong> Transaction date (YYYY-MM-DD, MM/DD/YYYY, etc.)</li>
                    <li><strong>Vendor/Merchant:</strong> Business name or description</li>
                    <li><strong>Amount:</strong> Transaction amount (numbers only)</li>
                    <li><strong>Description:</strong> Additional details about the expense (optional)</li>
                    <li><strong>Category:</strong> Expense category (optional)</li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="font-medium mb-1">Example CSV format:</p>
                    <code className="text-xs">
                      Date,Vendor,Amount,Description<br/>
                      2024-01-15,Shell Gas Station,45.67,Fuel for company car<br/>
                      2024-01-16,Office Depot,23.99,Printer paper for office
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && analysisResults && (
            <div className="space-y-6">
              {/* Analysis Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiDatabase} className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600">Total Records</p>
                      <p className="text-2xl font-bold text-blue-900">{analysisResults.totalRows}</p>
                    </div>
                  </div>
                </div>

                {analysisResults.summary?.totalAmount && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <SafeIcon icon={FiFileText} className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-green-600">Total Amount</p>
                        <p className="text-2xl font-bold text-green-900">
                          ${analysisResults.summary.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {analysisResults.summary?.averageAmount && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCheck} className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-purple-600">Average Amount</p>
                        <p className="text-2xl font-bold text-purple-900">
                          ${analysisResults.summary.averageAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Column Mapping */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Map Your Columns</h4>
                <p className="text-gray-600 mb-6">
                  Help us understand your data by mapping the columns to the correct fields.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['vendor', 'amount', 'date', 'description', 'category'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {['vendor', 'amount', 'date'].includes(field) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <select
                        value={columnMapping[field] || ''}
                        onChange={(e) => handleColumnMappingChange(field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select column...</option>
                        {analysisResults.columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                      {columnMapping[field] && analysisResults.columnAnalysis[columnMapping[field]] && (
                        <p className="text-xs text-gray-500 mt-1">
                          Sample: {analysisResults.columnAnalysis[columnMapping[field]].sampleValues.slice(0, 3).join(', ')}...
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Client Dropdown */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-1" />
                      Assign to Client (Optional)
                    </label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No client (expenses without client)</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                          {client.projectCode && ` (${client.projectCode})`}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      All imported receipts will be assigned to the selected client
                    </p>
                    {selectedClient && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <SafeIcon icon={FiUser} className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-blue-800 font-medium">
                            All {analysisResults.totalRows} records will be assigned to: {clients.find(c => c.id === parseInt(selectedClient))?.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!canProceed && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        Please map all required fields (Vendor, Amount, Date) to continue.
                      </p>
                    </div>
                  </div>
                )}

                {/* Description preview */}
                {columnMapping.description && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-2">Description Preview</h5>
                    <div className="text-sm text-green-800">
                      <p className="mb-2">Sample descriptions from your data:</p>
                      <div className="space-y-1">
                        {parsedData.slice(0, 3).map((row, index) => (
                          <div key={index} className="bg-white p-2 rounded border text-xs">
                            "{String(row[columnMapping.description] || 'No description')}"
                          </div>
                        ))}
                        {parsedData.length > 3 && (
                          <p className="text-xs text-green-600 mt-2">
                            ... and {parsedData.length - 3} more records with descriptions
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setStep(1);
                    setError(null);
                    setAnalysisResults(null);
                    setParsedData([]);
                    setColumnMapping({});
                    setSelectedClient('');
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={processImport}
                  disabled={!canProceed}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    canProceed
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Import {analysisResults.totalRows} Records
                  {selectedClient && ` to ${clients.find(c => c.id === parseInt(selectedClient))?.name}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default BulkImport;