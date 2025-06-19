import { LandingLayout } from "@/components/layout/landing-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Shield, Settings, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Chính Sách{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cookies
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Tìm hiểu cách chúng tôi sử dụng cookies và các công nghệ tương tự 
              để cải thiện trải nghiệm của bạn trên website.
            </p>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-orange-700 dark:text-orange-300">
                <strong>Cập nhật lần cuối:</strong> 15 tháng 1, 2025<br />
                <strong>Áp dụng cho:</strong> GiaKiemSo.com và các subdomain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What are Cookies */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                <Cookie className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Cookies Là Gì?
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-sm">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Cookies là những tệp tin nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. 
                Chúng giúp website &ldquo;nhớ&rdquo; thông tin về lần truy cập của bạn để cải thiện trải nghiệm sử dụng.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cookies Làm Gì?
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Ghi nhớ đăng nhập của bạn</li>
                    <li>Lưu tùy chọn ngôn ngữ và giao diện</li>
                    <li>Cải thiện hiệu suất website</li>
                    <li>Cung cấp nội dung phù hợp</li>
                    <li>Phân tích cách sử dụng website</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Thông Tin Cookies Chứa
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>ID phiên đăng nhập</li>
                    <li>Tùy chọn cá nhân hóa</li>
                    <li>Thời gian truy cập</li>
                    <li>Trang đã xem</li>
                    <li>Thông tin kỹ thuật của trình duyệt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Cookies */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Các Loại Cookies Chúng Tôi Sử Dụng
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Essential Cookies */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cookies Cần Thiết
                  </h3>
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Luôn được kích hoạt
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Những cookies này cần thiết cho hoạt động cơ bản của website và không thể tắt được.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>Xác thực đăng nhập</li>
                <li>Bảo mật phiên làm việc</li>
                <li>Ngăn chặn tấn công CSRF</li>
                <li>Cân bằng tải server</li>
                <li>Ghi nhớ lựa chọn cookie</li>
              </ul>
            </Card>

            {/* Functional Cookies */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cookies Chức Năng
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Có thể tắt
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Giúp cải thiện trải nghiệm bằng cách ghi nhớ tùy chọn của bạn.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>Chế độ sáng/tối</li>
                <li>Ngôn ngữ hiển thị</li>
                <li>Kích thước font chữ</li>
                <li>Bố cục dashboard</li>
                <li>Thông tin đã điền trong form</li>
              </ul>
            </Card>

            {/* Analytics Cookies */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cookies Phân Tích
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Có thể tắt
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện dịch vụ.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>Google Analytics</li>
                <li>Thống kê lượt truy cập</li>
                <li>Hành vi người dùng</li>
                <li>Hiệu suất trang</li>
                <li>Tỷ lệ thoát trang</li>
              </ul>
            </Card>

            {/* Marketing Cookies */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cookies Marketing
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Có thể tắt
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Được sử dụng để hiển thị quảng cáo phù hợp và đo lường hiệu quả marketing.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>Google Ads tracking</li>
                <li>Facebook Pixel</li>
                <li>Retargeting ads</li>
                <li>Conversion tracking</li>
                <li>A/B testing</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Quản Lý Cookies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Bạn có quyền kiểm soát hoàn toàn việc sử dụng cookies
            </p>
          </div>

          {/* Cookie Preferences */}
          <Card className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Tùy Chọn Cookies
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cookies Cần Thiết
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cần thiết cho hoạt động cơ bản của website
                  </p>
                </div>
                <div className="ml-4">
                  <ToggleRight className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Luôn bật</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cookies Chức Năng
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cải thiện trải nghiệm sử dụng
                  </p>
                </div>
                <div className="ml-4 text-center">
                  <ToggleRight className="w-8 h-8 text-green-500" />
                  <span className="text-sm text-green-600">Đã bật</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cookies Phân Tích
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Giúp cải thiện website
                  </p>
                </div>
                <div className="ml-4 text-center">
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Đã tắt</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cookies Marketing
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cá nhân hóa quảng cáo
                  </p>
                </div>
                <div className="ml-4 text-center">
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Đã tắt</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Lưu Tùy Chọn
              </Button>
              <Button variant="outline">
                Chấp Nhận Tất Cả
              </Button>
              <Button variant="outline">
                Từ Chối Tất Cả
              </Button>
            </div>
          </Card>

          {/* Browser Management */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quản Lý Qua Trình Duyệt
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn cũng có thể quản lý cookies trực tiếp thông qua cài đặt trình duyệt:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Chrome
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Settings → Privacy and security → Cookies and other site data
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Firefox
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Options → Privacy & Security → Cookies and Site Data
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Safari
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Preferences → Privacy → Manage Website Data
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Edge
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Settings → Cookies and site permissions → Cookies and site data
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Lưu ý:</strong> Việc tắt tất cả cookies có thể ảnh hưởng đến 
                chức năng của website và trải nghiệm sử dụng của bạn.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Third Party Cookies */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Cookies Bên Thứ Ba
          </h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Google Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Chúng tôi sử dụng Google Analytics để phân tích lưu lượng truy cập và cải thiện website.
              </p>
              <div className="flex items-center justify-between">
                <Link 
                  href="https://policies.google.com/privacy" 
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Chính sách quyền riêng tư Google
                </Link>
                <Link 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Tắt Google Analytics
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Intercom
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Dịch vụ chat hỗ trợ khách hàng trực tuyến.
              </p>
              <Link 
                href="https://www.intercom.com/privacy" 
                target="_blank"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Chính sách quyền riêng tư Intercom
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Stripe
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Xử lý thanh toán an toàn cho các giao dịch.
              </p>
              <Link 
                href="https://stripe.com/privacy" 
                target="_blank"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Chính sách quyền riêng tư Stripe
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Có Câu Hỏi Về Cookies?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Liên hệ với chúng tôi nếu bạn cần hỗ trợ về quản lý cookies
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:privacy@giakiemso.com">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Email: privacy@giakiemso.com
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Liên Hệ Hỗ Trợ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
