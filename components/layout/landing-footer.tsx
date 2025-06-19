import Link from "next/link";
import { BarChart3, Mail, MessageCircle, Facebook } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Gia Kiệm Số</span>
            </div>            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Giải pháp chuyển đổi số cho doanh nghiệp nhỏ và vừa. 
              Chúng tôi hiểu rõ nhu cầu và thách thức của doanh nghiệp Việt Nam.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:ericphan28@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                  ericphan28@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <a href="https://zalo.me/0907136029" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Zalo: 0907136029
                </a>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                📍 D2/062A, Nam Sơn, Quang Trung, Thống Nhất, Đồng Nai
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/thang.phan.334" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61577066581766" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sản Phẩm</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <Link href="/features/pos" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Hệ thống POS
                </Link>
              </li>
              <li>
                <Link href="/features/inventory" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Quản lý kho
                </Link>
              </li>
              <li>
                <Link href="/features/reports" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Báo cáo & phân tích
                </Link>
              </li>
              <li>
                <Link href="/features/ecommerce" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Bán hàng online
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Hỗ Trợ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Điều Khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Chính Sách Bảo Mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © 2025 Gia Kiệm Số. Bảo lưu mọi quyền.
            </div>
            
            <div className="flex space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
                Điều Khoản Sử Dụng
              </Link>
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                Bảo Mật
              </Link>
              <Link href="/cookies" className="hover:text-gray-700 dark:hover:text-gray-300">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
