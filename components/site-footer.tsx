import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-brand-foreground font-bold text-sm">TV</span>
              </div>
              <span className="font-bold text-xl text-foreground">Tiện ích Văn phòng</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Hệ thống module tiện ích toàn diện cho doanh nghiệp hiện đại. 
              Được xây dựng với công nghệ tiên tiến và thiết kế tối ưu.
            </p>
            <div className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                className="text-brand hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
              {" & "}
              <a
                href="https://nextjs.org"
                target="_blank"
                className="text-brand hover:underline"
                rel="noreferrer"
              >
                Next.js
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Modules</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/tools/tax-calculator" className="hover:text-foreground transition-colors">Tính thuế TNCN</Link></li>
              <li><Link href="/tools/qr-generator-v2" className="hover:text-foreground transition-colors">QR Generator</Link></li>
              <li><Link href="/tools/text-converter" className="hover:text-foreground transition-colors">Text Converter</Link></li>
              <li><Link href="/admin/modules" className="hover:text-foreground transition-colors">Xem tất cả</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Hệ thống</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/admin/modules" className="hover:text-foreground transition-colors">Quản lý Modules</Link></li>
              <li><Link href="/admin/dev-tools" className="hover:text-foreground transition-colors">Dev Tools</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Tiện ích Văn phòng. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
