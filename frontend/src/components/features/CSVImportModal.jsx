import { useState, useRef } from 'react';
import Button from '../common/Button';

export default function CSVImportModal({ isOpen, onClose, onImport, loading }) {
  const [csvData, setCsvData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseCSV(text);
        setCsvData(parsed);
      } catch (error) {
        alert('Error parsing CSV file. Please check the format.');
        console.error('CSV parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (csvData.length === 0) {
      alert('No data to import');
      return;
    }
    
    onImport(csvData);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      
      values.push(current.trim().replace(/"/g, ''));
      
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      return obj;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl shadow-xl border border-slate-700 w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Import Products from CSV</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select CSV File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-slate-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-500 file:text-white
                hover:file:bg-primary-600
                file:cursor-pointer"
            />
          </div>

          <div className="text-xs text-slate-400">
            <p className="font-semibold mb-1">Expected CSV format:</p>
            <p>name,sku,category,price,quantity,lowStockThreshold</p>
            <p className="mt-1">Example: "Widget A","W001","Electronics",29.99,50,10</p>
          </div>

          {csvData.length > 0 && (
            <p className="text-sm text-slate-300">
              Ready to import {csvData.length} products
            </p>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleImport}
              disabled={csvData.length === 0 || loading}
            >
              {loading ? 'Importing...' : `Import ${csvData.length} Products`}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
