'use client';

import React, { useState } from 'react';

export default function TextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [conversionType, setConversionType] = useState('uppercase');

  const conversions = {
    uppercase: (text: string) => text.toUpperCase(),
    lowercase: (text: string) => text.toLowerCase(),
    capitalize: (text: string) => text.replace(/\b\w/g, l => l.toUpperCase()),
    camelCase: (text: string) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
    kebabCase: (text: string) => text.toLowerCase().replace(/\s+/g, '-'),
    snakeCase: (text: string) => text.toLowerCase().replace(/\s+/g, '_'),
    reverse: (text: string) => text.split('').reverse().join(''),
    removeSpaces: (text: string) => text.replace(/\s+/g, ''),
    removeNumbers: (text: string) => text.replace(/[0-9]/g, ''),
    removeSpecialChars: (text: string) => text.replace(/[^a-zA-Z0-9\s]/g, ''),
  };

  const handleConvert = () => {
    const converter = conversions[conversionType as keyof typeof conversions];
    if (converter) {
      setOutput(converter(input));
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    // Could add toast notification here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">🔤 Chuyển đổi văn bản</h1>
          <p className="text-muted-foreground">Công cụ chuyển đổi định dạng văn bản, mã hóa, và xử lý text</p>
        </div>

        {/* Conversion Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Loại chuyển đổi:
          </label>
          <select 
            value={conversionType} 
            onChange={(e) => setConversionType(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="uppercase">CHỮ HOA</option>
            <option value="lowercase">chữ thường</option>
            <option value="capitalize">Chữ Đầu Hoa</option>
            <option value="camelCase">camelCase</option>
            <option value="kebabCase">kebab-case</option>
            <option value="snakeCase">snake_case</option>
            <option value="reverse">Đảo ngược</option>
            <option value="removeSpaces">Xóa khoảng trắng</option>
            <option value="removeNumbers">Xóa số</option>
            <option value="removeSpecialChars">Xóa ký tự đặc biệt</option>
          </select>
        </div>

        {/* Input Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Văn bản gốc:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập văn bản cần chuyển đổi..."
            className="w-full h-32 p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>

        {/* Convert Button */}
        <div className="mb-6 text-center">
          <button
            onClick={handleConvert}
            className="px-6 py-2 bg-brand text-brand-foreground rounded-md hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-colors"
          >
            🔄 Chuyển đổi
          </button>
        </div>

        {/* Output Text Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Kết quả:
          </label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              className="w-full h-32 p-3 border border-border rounded-md bg-muted text-foreground"
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-1 bg-brand text-brand-foreground text-sm rounded hover:bg-brand/90 transition-colors"
              >
                📋 Sao chép
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        {input && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">{input.length}</div>
              <div className="text-sm text-muted-foreground">Ký tự</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">{input.split(/\s+/).filter(w => w).length}</div>
              <div className="text-sm text-muted-foreground">Từ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">{input.split('\n').length}</div>
              <div className="text-sm text-muted-foreground">Dòng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">{input.split(/[.!?]+/).filter(s => s.trim()).length}</div>
              <div className="text-sm text-muted-foreground">Câu</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: 'text-converter',
  name: 'TextConverter',
  component: TextConverter
};