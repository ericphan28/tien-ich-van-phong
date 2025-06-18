import React, { useState } from 'react';
import Image from 'next/image';
import { useModuleState } from './hooks/useModuleState';

export interface QrGeneratorV2Props {
  className?: string;
}

export default function QrGeneratorV2({ className }: QrGeneratorV2Props) {
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const { updateState } = useModuleState({ lastGenerated: '' });

  const generateQRCode = () => {
    updateState({ lastGenerated: text });
  };

  const qrCodeUrl = text ? 
    `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}` : 
    '';

  return (
    <div className={`p-6 max-w-2xl mx-auto ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">🔗 QR Code Generator V2</h2>
      
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nhập nội dung cần tạo QR Code:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập text, URL, số điện thoại..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Kích thước: {qrSize}px
            </label>
            <input
              type="range"
              min="100"
              max="500"
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <button
            onClick={generateQRCode}
            disabled={!text}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            Tạo QR Code
          </button>
        </div>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <div className="text-center space-y-4">
            <div className="border-2 border-border rounded-lg p-4 bg-card inline-block">
              <Image 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="mx-auto"
                width={qrSize}
                height={qrSize}
                unoptimized={true}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Nội dung:</strong> {text}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Kích thước:</strong> {qrSize}x{qrSize}px
              </p>
              
              <div className="flex gap-2 justify-center">
                <a
                  href={qrCodeUrl}
                  download={`qr-code-${Date.now()}.png`}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  📥 Tải xuống
                </a>
                
                <button
                  onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                  className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
                >
                  📋 Copy URL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Templates */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Mẫu nhanh:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => setText('https://google.com')}
              className="text-left p-2 border rounded hover:bg-gray-50 text-sm"
            >
              🌐 Website URL
            </button>
            <button
              onClick={() => setText('tel:+84987654321')}
              className="text-left p-2 border rounded hover:bg-gray-50 text-sm"
            >
              📞 Số điện thoại
            </button>
            <button
              onClick={() => setText('mailto:email@example.com')}
              className="text-left p-2 border rounded hover:bg-gray-50 text-sm"
            >
              📧 Email
            </button>
            <button
              onClick={() => setText('WIFI:T:WPA;S:MyNetwork;P:password123;;')}
              className="text-left p-2 border rounded hover:bg-gray-50 text-sm"
            >
              📶 WiFi Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export module info for registration
export const moduleInfo = {
  id: 'qr-generator-v2',
  name: 'QR Generator V2',
  component: QrGeneratorV2
};