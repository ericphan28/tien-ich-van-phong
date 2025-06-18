'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HelpButton() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="flex items-center gap-1 bg-brand hover:bg-brand/90 text-brand-foreground px-3 py-1 rounded-full text-xs transition-colors font-medium"
        title="Trợ giúp và hướng dẫn"
      >
        <span>❓</span>
        <span>Trợ giúp</span>
      </button>

      {showHelp && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowHelp(false)}
          />
          
          {/* Help Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-lg rounded-lg shadow-xl border border-border z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-brand/5 to-brand/10 border-b border-border">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">🆘</span>
                  Trợ giúp nhanh
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-background/50 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Hướng dẫn và phím tắt hữu ích</p>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <span>🔗</span> Liên kết nhanh
                </h4>
                <div className="space-y-1">
                  <Link 
                    href="/admin/modules"
                    className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 hover:bg-brand/10 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setShowHelp(false)}
                  >
                    <span>⚙️</span> Quản lý Modules
                  </Link>
                  <Link 
                    href="/tools/tax-calculator"
                    className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 hover:bg-brand/10 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setShowHelp(false)}
                  >
                    <span>📊</span> Tính thuế TNCN
                  </Link>
                  <Link 
                    href="/tools/qr-generator-v2"
                    className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 hover:bg-brand/10 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setShowHelp(false)}
                  >
                    <span>📱</span> QR Generator
                  </Link>
                </div>
              </div>

              {/* Quick Tips */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <span>💡</span> Mẹo sử dụng
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <div className="bg-brand/10 border border-brand/20 rounded-md p-3">
                    <strong className="text-foreground">Bookmark modules:</strong><br />
                    <span>Ctrl+D trên URL module để truy cập nhanh</span>
                  </div>
                  <div className="bg-brand/10 border border-brand/20 rounded-md p-3">
                    <strong className="text-foreground">Cài module mới:</strong><br />
                    <span>Vào Quản lý → Click &quot;Cài đặt&quot;</span>
                  </div>
                  <div className="bg-brand/10 border border-brand/20 rounded-md p-3">
                    <strong className="text-foreground">Module bị lỗi:</strong><br />
                    <span>Refresh page hoặc disable/enable lại</span>
                  </div>
                </div>
              </div>

              {/* Shortcuts */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <span>⌨️</span> Phím tắt
                </h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between items-center py-1">
                    <span>Trang chủ:</span>
                    <code className="bg-muted text-foreground px-2 py-1 rounded text-xs font-mono">Alt + H</code>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Quản lý Modules:</span>
                    <code className="bg-muted text-foreground px-2 py-1 rounded text-xs font-mono">Alt + M</code>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Tax Calculator:</span>
                    <code className="bg-muted text-foreground px-2 py-1 rounded text-xs font-mono">Alt + T</code>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="border-t border-border pt-3">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <span>📊</span> Trạng thái hệ thống
                </h4>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Modules khả dụng:</span>
                    <span className="text-brand font-medium bg-brand/10 px-2 py-1 rounded">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Modules đã cài:</span>
                    <span className="text-brand font-medium bg-brand/10 px-2 py-1 rounded">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">System status:</span>
                    <span className="text-brand font-medium bg-brand/10 px-2 py-1 rounded">✅ Online</span>
                  </div>
                </div>
              </div>

              {/* Documentation */}
              <div className="border-t border-border pt-3">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <span>📚</span> Tài liệu
                </h4>
                <div className="space-y-1">
                  <a 
                    href="/USER-GUIDE.md"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 hover:bg-brand/10 px-3 py-2 rounded-md transition-colors"
                  >
                    <span>📖</span> Hướng dẫn đầy đủ
                  </a>
                  <a 
                    href="/QUICK-START.md"
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-brand hover:text-brand/80 hover:bg-brand/10 px-3 py-2 rounded-md transition-colors"
                  >
                    <span>⚡</span> Quick Start
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
