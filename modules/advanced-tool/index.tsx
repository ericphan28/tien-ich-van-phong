'use client';

import React, { useState, useEffect } from 'react';

interface SystemInfo {
  userAgent: string;
  platform: string;
  language: string;
  cookieEnabled: boolean;
  onlineStatus: boolean;
  screenResolution: string;
  colorDepth: number;
  timeZone: string;
}

export default function AdvancedTool() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    // Get system information
    if (typeof window !== 'undefined') {
      setSystemInfo({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (error) {
      setJsonError('JSON không hợp lệ: ' + (error as Error).message);
      setJsonOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError('');
    } catch (error) {
      setJsonError('JSON không hợp lệ: ' + (error as Error).message);
      setJsonOutput('');
    }
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generatePassword = (length: number = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">⚡ Công cụ nâng cao</h1>
        <p className="text-purple-100">Bộ công cụ đa năng cho developers và power users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Information */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">💻</span>
            Thông tin hệ thống
          </h2>
          
          {systemInfo && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-600">Platform:</div>
                <div className="text-gray-800">{systemInfo.platform}</div>
                
                <div className="font-medium text-gray-600">Language:</div>
                <div className="text-gray-800">{systemInfo.language}</div>
                
                <div className="font-medium text-gray-600">Screen:</div>
                <div className="text-gray-800">{systemInfo.screenResolution}</div>
                
                <div className="font-medium text-gray-600">Color Depth:</div>
                <div className="text-gray-800">{systemInfo.colorDepth} bit</div>
                
                <div className="font-medium text-gray-600">Time Zone:</div>
                <div className="text-gray-800">{systemInfo.timeZone}</div>
                
                <div className="font-medium text-gray-600">Online:</div>
                <div className={`font-semibold ${systemInfo.onlineStatus ? 'text-green-600' : 'text-red-600'}`}>
                  {systemInfo.onlineStatus ? '✅ Online' : '❌ Offline'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clock */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🕒</span>
            Đồng hồ thời gian thực
          </h2>
          
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
              {currentTime.toLocaleTimeString('vi-VN')}
            </div>
            <div className="text-lg text-gray-600">
              {currentTime.toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Timestamp: {currentTime.getTime()}
            </div>
          </div>
        </div>

        {/* JSON Formatter */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">📝</span>
            JSON Formatter
          </h2>
          
          <div className="space-y-4">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Nhập JSON cần format..."
              className="w-full h-24 p-3 border border-gray-300 rounded-md font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <button
                onClick={formatJson}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Format
              </button>
              <button
                onClick={minifyJson}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Minify
              </button>
            </div>

            {jsonError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {jsonError}
              </div>
            )}

            {jsonOutput && (
              <div className="relative">
                <textarea
                  value={jsonOutput}
                  readOnly
                  className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(jsonOutput)}
                  className="absolute top-2 right-2 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Generators */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🎲</span>
            Generators
          </h2>
          
          <div className="space-y-4">
            {/* UUID Generator */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">UUID Generator</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generateUUID()}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(generateUUID())}
                  className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  Copy New
                </button>
              </div>
            </div>

            {/* Password Generator */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Password Generator</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatePassword(16)}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(generatePassword(16))}
                  className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                >
                  Copy New
                </button>
              </div>
            </div>

            {/* Random Number */}
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Random Number (1-1000)</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={Math.floor(Math.random() * 1000) + 1}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(String(Math.floor(Math.random() * 1000) + 1))}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Copy New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: 'advanced-tool',
  name: 'AdvancedTool',
  component: AdvancedTool
};