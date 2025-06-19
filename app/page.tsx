import { LandingLayout } from "@/components/layout/landing-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShoppingCart, Users, Package, TrendingUp, Shield } from "lucide-react";

export default function Home() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Giải Pháp{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Chuyển Đổi Số
              </span>
              <br />
              Cho Hộ Kinh Doanh
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Giải pháp quản lý bán hàng đơn giản, hiệu quả cho cửa hàng và doanh nghiệp nhỏ. 
              Được phát triển bởi doanh nhân hiểu rõ những thách thức thực tế mà bạn đang gặp phải.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                  Bắt Đầu Miễn Phí
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Đăng Nhập Hệ Thống
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Bảo mật dữ liệu</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Được tin dùng bởi các chủ cửa hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Dễ sử dụng, hiệu quả</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tại Sao Chọn Gia Kiệm Số?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Những tính năng thiết yếu giúp bạn quản lý cửa hàng một cách chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quản Lý Bán Hàng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tạo đơn hàng, theo dõi thanh toán, quản lý khách hàng và in hóa đơn điện tử một cách dễ dàng
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• Point of Sale (POS) hiện đại</li>
                <li>• Hóa đơn điện tử tự động</li>
                <li>• Theo dõi đơn hàng realtime</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quản Lý Kho Hàng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Theo dõi tồn kho, cảnh báo hết hàng, quản lý xuất nhập kho và nhà cung cấp
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• Cảnh báo tồn kho thấp</li>
                <li>• Quản lý nhiều kho</li>
                <li>• Xuất nhập kho tự động</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Báo Cáo & Phân Tích
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Dashboard trực quan với báo cáo doanh thu, phân tích xu hướng và dự báo kinh doanh
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• Dashboard realtime</li>
                <li>• Báo cáo tài chính</li>
                <li>• Phân tích xu hướng</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Bắt Đầu Số Hóa Cửa Hàng Của Bạn
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Tham gia cùng những chủ cửa hàng đang sử dụng Gia Kiệm Số để quản lý kinh doanh hiệu quả hơn
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Dùng Thử 14 Ngày Miễn Phí
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
