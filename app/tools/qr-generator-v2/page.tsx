'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import để tránh SSR issues
const QrGeneratorV2 = dynamic(() => import('../../../modules/qr-generator-v2/index'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Đang tải QR Generator V2...</p>
      </div>
    </div>
  )
});

export default function QrGeneratorV2Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <QrGeneratorV2 />
        </div>
        
        {/* Navigation */}
        <div className="mt-6 text-center space-x-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Về trang chủ
          </Link>
          <Link 
            href="/admin/modules" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Module Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
