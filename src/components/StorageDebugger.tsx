import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const StorageDebugger: React.FC = () => {
  const [storageData, setStorageData] = useState<{[key: string]: any}>({});

  const loadStorageData = () => {
    const keys = [
      'koto_categories',
      'koto_tool_categories', 
      'koto_subcategories',
      'koto_prompt_categories' // Check for old wrong key
    ];
    
    const data: {[key: string]: any} = {};
    keys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          data[key] = JSON.parse(stored);
        } catch (e) {
          data[key] = stored; // Store as string if not JSON
        }
      } else {
        data[key] = null;
      }
    });
    
    setStorageData(data);
  };

  const migrateData = () => {
    const wrongData = localStorage.getItem('koto_prompt_categories');
    
    if (wrongData) {
      try {
        const existing = localStorage.getItem('koto_categories') || '[]';
        const existingData = JSON.parse(existing);
        const wrongDataParsed = JSON.parse(wrongData);
        
        // Merge data, avoiding duplicates
        const merged = [...existingData];
        wrongDataParsed.forEach((item: any) => {
          if (!existingData.find((ex: any) => ex.id === item.id)) {
            merged.push(item);
          }
        });
        
        // Save merged data to correct key
        localStorage.setItem('koto_categories', JSON.stringify(merged));
        
        // Remove wrong key
        localStorage.removeItem('koto_prompt_categories');
        
        alert('Migration completed successfully!');
        loadStorageData(); // Refresh display
      } catch (error) {
        alert('Migration failed: ' + (error as Error).message);
      }
    } else {
      alert('No data found in koto_prompt_categories - no migration needed');
    }
  };

  const clearStorage = (key: string) => {
    if (confirm(`Are you sure you want to clear ${key}?`)) {
      localStorage.removeItem(key);
      loadStorageData();
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Storage Debugger</CardTitle>
          <div className="flex gap-2">
            <Button onClick={loadStorageData} size="sm">Refresh</Button>
            <Button onClick={migrateData} size="sm" variant="outline">Migrate Data</Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.entries(storageData).map(([key, value]) => (
            <div key={key} className="mb-4 p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{key}</h3>
                <Button 
                  onClick={() => clearStorage(key)} 
                  size="sm" 
                  variant="destructive"
                  disabled={!value}
                >
                  Clear
                </Button>
              </div>
              <div className="text-sm">
                {value ? (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <span className="text-gray-500">No data</span>
                )}
              </div>
              {Array.isArray(value) && (
                <div className="text-xs text-gray-600 mt-1">
                  Count: {value.length} items
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageDebugger;