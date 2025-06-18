'use client';

import React, { useState } from 'react';
import Header from '@/components/site-header';
import { createModuleSDK } from '@/core/module-engine/sdk';

export default function DevToolsPage() {
  const [sdkDemo, setSdkDemo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSDK = async () => {
    try {
      setLoading(true);
      const sdk = createModuleSDK('dev-tools');
      
      // Test storage functionality
      await sdk.storage.set('test-key', { message: 'Hello SDK!', timestamp: Date.now() });
      const storageData = await sdk.storage.get('test-key');
      
      // Test user info
      const userInfo = await sdk.user.getCurrentUser();
      
      // Test system info
      const systemInfo = sdk.system.getSystemInfo();
      
      setSdkDemo(`
SDK Test Results:
✅ Storage: ${JSON.stringify(storageData, null, 2)}
✅ User: ${JSON.stringify(userInfo, null, 2)}
✅ System: ${JSON.stringify(systemInfo, null, 2)}
✅ Module SDK initialized successfully
      `);
    } catch (error) {
      setSdkDemo(`SDK Test Failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            🛠️ Developer Tools
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Module SDK Test
            </h2>
            
            <button
              onClick={testSDK}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Module SDK'}
            </button>
            
            {sdkDemo && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {sdkDemo}
                </pre>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Development Notes
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Module SDK provides storage, user, and system APIs</li>
              <li>• All modules run in sandboxed environment</li>
              <li>• Permission system controls access to sensitive APIs</li>
              <li>• Event system allows inter-module communication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
