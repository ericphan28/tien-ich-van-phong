import { LandingLayout } from "@/components/layout/landing-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Globe, 
  Users,
  CreditCard,
  Smartphone,
  Cloud,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Tính Năng{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Toàn Diện
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Hệ thống quản lý bán hàng đa năng với đầy đủ tính năng cần thiết 
              cho doanh nghiệp hiện đại, từ POS đến e-commerce.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                  Dùng Thử Miễn Phí
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Tư Vấn Chi Tiết
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Các Tính Năng Chính
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Giải pháp toàn diện cho mọi nhu cầu quản lý kinh doanh
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* POS System */}
            <Link href="/features/pos" className="group">
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Hệ Thống POS
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Point of Sale hiện đại với giao diện trực quan, xử lý thanh toán nhanh chóng
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Thanh toán đa hình thức
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    In hóa đơn tự động
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Quản lý ca làm việc
                  </li>
                </ul>
              </Card>
            </Link>

            {/* Inventory Management */}
            <Link href="/features/inventory" className="group">
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Quản Lý Kho
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Theo dõi tồn kho theo thời gian thực, cảnh báo hết hàng, quản lý nhà cung cấp
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Cảnh báo tồn kho thấp
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Xuất nhập kho tự động
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Quản lý nhiều kho
                  </li>
                </ul>
              </Card>
            </Link>

            {/* Reports & Analytics */}
            <Link href="/features/reports" className="group">
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Báo Cáo & Phân Tích
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Dashboard trực quan với báo cáo chi tiết về doanh thu, lợi nhuận, xu hướng
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Dashboard realtime
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Báo cáo tài chính
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Phân tích xu hướng
                  </li>
                </ul>
              </Card>
            </Link>

            {/* E-commerce */}
            <Link href="/features/ecommerce" className="group">
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Bán Hàng Online
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Tích hợp website bán hàng, đồng bộ kho hàng online và offline
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Website tích hợp
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Đồng bộ kho hàng
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Quản lý đơn hàng
                  </li>
                </ul>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Tính Năng Bổ Sung
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Những tính năng mạnh mẽ khác để hỗ trợ doanh nghiệp của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Customer Management */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Quản Lý Khách Hàng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                CRM tích hợp, chương trình khuyến mãi, điểm thưởng
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Database khách hàng</li>
                <li>• Lịch sử mua hàng</li>
                <li>• Chương trình loyalty</li>
              </ul>
            </Card>

            {/* Payment Processing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Thanh Toán Đa Dạng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Hỗ trợ nhiều hình thức thanh toán, tích hợp gateway
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Tiền mặt, thẻ, chuyển khoản</li>
                <li>• QR Code, ví điện tử</li>
                <li>• Trả góp, đặt cọc</li>
              </ul>
            </Card>

            {/* Mobile App */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Ứng Dụng Mobile
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                App mobile cho chủ cửa hàng và nhân viên bán hàng
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Bán hàng di động</li>
                <li>• Theo dõi doanh thu</li>
                <li>• Quản lý từ xa</li>
              </ul>
            </Card>

            {/* Cloud Storage */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Lưu Trữ Cloud
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Dữ liệu được lưu trữ an toàn trên cloud với backup tự động
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Backup tự động</li>
                <li>• Truy cập mọi lúc, mọi nơi</li>
                <li>• Đồng bộ đa thiết bị</li>
              </ul>
            </Card>

            {/* Security */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Bảo Mật Cao
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Mã hóa end-to-end, phân quyền chi tiết, audit log
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Mã hóa dữ liệu</li>
                <li>• Xác thực 2 yếu tố</li>
                <li>• Phân quyền theo vai trò</li>
              </ul>
            </Card>

            {/* Performance */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Hiệu Suất Cao
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Xử lý nhanh chóng, uptime 99.9%, scalable architecture
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Phản hồi dưới 100ms</li>
                <li>• Uptime 99.9%</li>
                <li>• Auto-scaling</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              So Sánh Gói Dịch Vụ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Chọn gói phù hợp với quy mô doanh nghiệp của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="p-8 relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Cơ Bản
                </h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  499k
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  /tháng
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  1 cửa hàng
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  POS cơ bản
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Quản lý kho
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Báo cáo cơ bản
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  5 nhân viên
                </li>
              </ul>
              
              <Button className="w-full" variant="outline">
                Bắt Đầu Dùng Thử
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 relative border-2 border-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Phổ Biến
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Chuyên Nghiệp
                </h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  999k
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  /tháng
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  3 cửa hàng
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  POS đầy đủ
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  E-commerce tích hợp
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Báo cáo nâng cao
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  15 nhân viên
                </li>
              </ul>
              
              <Button className="w-full">
                Bắt Đầu Dùng Thử
              </Button>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8 relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Doanh Nghiệp
                </h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  Liên hệ
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  tùy chỉnh
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Không giới hạn cửa hàng
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Tính năng đầy đủ
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  API tùy chỉnh
                </li>                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Hỗ trợ ưu tiên
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  Không giới hạn nhân viên
                </li>
              </ul>
              
              <Button className="w-full" variant="outline">
                Liên Hệ Tư Vấn
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Sẵn Sàng Trải Nghiệm Tất Cả Tính Năng?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký ngay để dùng thử miễn phí 30 ngày, không cần thẻ tín dụng
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Dùng Thử Miễn Phí 30 Ngày
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Tư Vấn Miễn Phí
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
