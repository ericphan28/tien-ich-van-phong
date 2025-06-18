'use client';

import React, { useState } from 'react';
import Header from '@/components/site-header';
import { ModuleSDK } from '@/core/module-engine/sdk';

interface PermissionResults {
  storageWrite: boolean;
  networkApi: boolean;
  allPermissions: string[];
}

interface SecurityScanResult {
  summary: {
    passed: boolean;
    score: number;
    issuesFound: number;
  };
  issues: SecurityIssue[];
  recommendations: string[];
}

interface SecurityIssue {
  type: 'vulnerability' | 'warning' | 'info' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  file: string;
  line?: number;
  description: string;
}

export default function ModuleDevelopmentPage() {
  const [selectedModule, setSelectedModule] = useState('tax-calculator');
  const [scanResults, setScanResults] = useState<SecurityScanResult | null>(null);
  const [permissions, setPermissions] = useState<PermissionResults | null>(null);
  const [sdkDemo, setSdkDemo] = useState<string>('');
  // SDK functionality test using real ModuleSDK
  const testSDK = async () => {
    try {
      const sdk = new ModuleSDK('dev-tools');
      
      // Test storage functionality
      await sdk.storage.set('test-key', { message: 'Hello SDK!', timestamp: Date.now() });
      const storageData = await sdk.storage.get('test-key');
      
      // Test user info
      const userInfo = sdk.user.getInfo();
      
      // Test system info
      const systemInfo = sdk.system.getInfo();
      
      setSdkDemo(`
SDK Test Results:
✅ Storage: ${JSON.stringify(storageData, null, 2)}
✅ User: ${JSON.stringify(userInfo, null, 2)}
✅ System: ${JSON.stringify(systemInfo, null, 2)}
✅ Module ID: ${sdk.getModuleId()}
      `);
    } catch (error) {
      setSdkDemo(`SDK Test Failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Permission system test using real permissions
  const testPermissions = async () => {
    try {
      const sdk = new ModuleSDK('dev-tools');
      
      const storageRead = await sdk.permissions.check('storage.read');
      const storageWrite = await sdk.permissions.check('storage.write');
      const networkApi = await sdk.permissions.check('network.api');
      
      setPermissions({
        storageWrite: storageWrite,
        networkApi: networkApi,
        allPermissions: [
          ...(storageRead ? ['storage.read'] : []),
          ...(storageWrite ? ['storage.write'] : []),
          ...(networkApi ? ['network.api'] : [])
        ]
      });
    } catch (error) {
      setPermissions({
        storageWrite: false,
        networkApi: false,
        allPermissions: [`Error: ${error instanceof Error ? error.message : String(error)}`]
      });
    }
  };  // Security scanner using mock security analysis
  const runSecurityScan = async () => {
    try {
      // Mock security scan results based on selected module
      const results: SecurityScanResult = {
        summary: {
          passed: true,
          score: 95,
          issuesFound: 1
        },
        issues: [{
          type: 'info',
          severity: 'low',
          message: `Module '${selectedModule}' follows security best practices`,
          file: 'index.tsx',
          line: 1,
          description: 'No security vulnerabilities detected in this demo scan'
        }],
        recommendations: [
          'Continue following security best practices',
          'Regular security audits recommended',
          'Keep dependencies updated'
        ]
      };
      
      setScanResults(results);
    } catch (error) {
      setScanResults({
        summary: {
          passed: false,
          score: 0,
          issuesFound: 1
        },
        issues: [{
          type: 'error',
          severity: 'high',
          message: `Security scan failed: ${error instanceof Error ? error.message : String(error)}`,
          file: 'scanner',
          line: 0,
          description: 'Could not complete security analysis'
        }],
        recommendations: ['Check module configuration and try again']
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header showNavLinks={false} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              🛠️ Module Development Tools
            </h1>
            <p className="text-muted-foreground text-lg">
              Test và debug các module trong quá trình phát triển
            </p>
          </div>
          
          {/* Module Selector */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-foreground">📦 Chọn Module để Test</h2>
            <select 
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-brand/20 focus:border-brand"
            >
              <option value="tax-calculator">💰 Tax Calculator</option>
              <option value="salary-calculator">💼 Salary Calculator</option>
              <option value="qr-generator">📱 QR Generator</option>
              <option value="demo-module">🎮 Demo Module</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SDK Testing */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-foreground">🔧 Module SDK Testing</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Test các API của Module SDK như storage, notifications, user info
              </p>
              <button
                onClick={testSDK}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-brand to-accent text-brand-foreground rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                🚀 Run SDK Test
              </button>
              {sdkDemo && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">📊 Test Results:</h3>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{sdkDemo}</pre>
                </div>
              )}
            </div>

            {/* Permission Testing */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-4 text-foreground">🔐 Permission Testing</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Test hệ thống quyền và permissions của module
              </p>
              <button
                onClick={testPermissions}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                🔍 Test Permissions
              </button>
              {permissions && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{permissions.storageWrite ? '✅' : '❌'}</span>
                      <span>Storage Write</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{permissions.networkApi ? '✅' : '❌'}</span>
                      <span>Network API</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">All Permissions:</h4>
                    <div className="text-xs text-muted-foreground">
                      {permissions.allPermissions.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Scanner */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foreground">🛡️ Security Scanner</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Quét bảo mật module để tìm lỗ hổng và đưa ra khuyến nghị
              </p>
              <button
                onClick={runSecurityScan}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                🔍 Run Security Scan
              </button>
              
              {scanResults && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className={`p-4 rounded-lg ${
                    scanResults.summary.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {scanResults.summary.passed ? '✅ Scan Passed' : '❌ Scan Failed'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Score: {scanResults.summary.score}/100 | Issues: {scanResults.summary.issuesFound}
                        </p>
                      </div>
                      <div className="text-2xl">
                        {scanResults.summary.passed ? '🛡️' : '⚠️'}
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {scanResults.issues.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">🚨 Security Issues</h3>
                      <div className="space-y-3">
                        {scanResults.issues.map((issue: SecurityIssue, index: number) => (
                          <div key={index} className={`p-3 rounded-lg border ${
                            issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                            issue.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                            issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{issue.message}</div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {issue.severity}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              📁 {issue.file} {issue.line && `(line ${issue.line})`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {issue.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {scanResults.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">💡 Recommendations</h3>
                      <ul className="space-y-2">
                        {scanResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="text-brand mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Development Tips */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foreground">📚 Development Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-blue-600 text-xl mb-2">🔒</div>
                  <h3 className="font-semibold text-blue-900 mb-1">Security First</h3>
                  <p className="text-sm text-blue-700">
                    Luôn validate input và escape output để tránh XSS
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-green-600 text-xl mb-2">⚡</div>
                  <h3 className="font-semibold text-green-900 mb-1">Performance</h3>
                  <p className="text-sm text-green-700">
                    Sử dụng lazy loading và memoization cho optimization
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-purple-600 text-xl mb-2">🎨</div>
                  <h3 className="font-semibold text-purple-900 mb-1">UI/UX</h3>
                  <p className="text-sm text-purple-700">
                    Tuân thủ design system và accessibility guidelines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}