'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { moduleManager } from '@/core/module-engine/manager';

export default function WelcomeGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const installedCount = moduleManager.getInstalledModules().length;
  const availableCount = moduleManager.getAvailableModules().length;

  if (!isVisible) return null;

  const steps = [
    {
      title: "🎉 Chào mừng đến với Office Module System!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Hệ thống tiện ích văn phòng modular với {availableCount} modules chuyên nghiệp.
            Hiện tại bạn đã cài {installedCount} modules.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 Modules nổi bật:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>📊 <strong>Máy tính thuế TNCN</strong> - Chuẩn Việt Nam 2024</li>
              <li>📱 <strong>QR Generator</strong> - Tạo QR cho text, URL, email</li>
              <li>🔤 <strong>Text Converter</strong> - 10 loại chuyển đổi văn bản</li>
              <li>⚡ <strong>Developer Tools</strong> - JSON, UUID, Password generators</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "📦 Cách cài đặt modules",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Truy cập <strong>Quản lý Modules</strong> để cài đặt thêm công cụ:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">⚙️ Admin Interface</h4>
              <Link 
                href="/admin/modules"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                Mở ngay →
              </Link>
            </div>
            <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
              <li>Vào trang Quản lý Modules</li>
              <li>Xem danh sách modules trong Marketplace</li>
              <li>Click <strong>&quot;Cài đặt&quot;</strong> trên module cần dùng</li>
              <li>Module sẽ xuất hiện trên navigation bar</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "🎯 Cách sử dụng modules",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Sau khi cài đặt, modules sẽ xuất hiện automatic trên thanh menu:
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">📍 Quick Access</h4>            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-card rounded p-3 border">
                <div className="font-medium text-foreground">📊 Tax Calculator</div>
                <div className="text-muted-foreground">/tools/tax-calculator</div>
              </div>
              <div className="bg-card rounded p-3 border">
                <div className="font-medium text-foreground">📱 QR Generator</div>
                <div className="text-muted-foreground">/tools/qr-generator-v2</div>
              </div>              <div className="bg-card rounded p-3 border">
                <div className="font-medium text-foreground">🔤 Text Converter</div>
                <div className="text-muted-foreground">/tools/text-converter</div>
              </div>
              <div className="bg-card rounded p-3 border">
                <div className="font-medium text-foreground">⚡ Advanced Tool</div>
                <div className="text-muted-foreground">/tools/advanced-tool</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "🎊 Sẵn sàng sử dụng!",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn đã sẵn sàng tận hưởng office module system!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">🔗 Quick Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Link 
                href="/admin/modules"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                ⚙️ Quản lý Modules
              </Link>
              <Link 
                href="/tools/tax-calculator"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                📊 Tính thuế TNCN
              </Link>
              <Link 
                href="/tools/qr-generator-v2"
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                📱 QR Generator
              </Link>
              <Link 
                href="/tools/advanced-tool"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                ⚡ Developer Tools
              </Link>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => setIsVisible(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
            >
              Đóng hướng dẫn
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Hướng dẫn sử dụng</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center mt-3">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index + 1 <= currentStep ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-3 text-blue-100">
              Bước {currentStep} / {steps.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {steps[currentStep - 1].title}
          </h3>
          {steps[currentStep - 1].content}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded transition-colors ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            ← Trước
          </button>
          
          <div className="text-sm text-gray-500 flex items-center">
            💡 Tip: Bookmark các modules thường dùng!
          </div>

          <button
            onClick={() => {
              if (currentStep === steps.length) {
                setIsVisible(false);
              } else {
                setCurrentStep(Math.min(steps.length, currentStep + 1));
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            {currentStep === steps.length ? 'Hoàn thành' : 'Tiếp →'}
          </button>
        </div>
      </div>
    </div>
  );
}
