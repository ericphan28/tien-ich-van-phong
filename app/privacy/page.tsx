import { LandingLayout } from "@/components/layout/landing-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  UserCheck, 
  Settings,
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Chính Sách{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bảo Mật
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. 
              Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>Cập nhật lần cuối:</strong> 15 tháng 1, 2025<br />
                <strong>Hiệu lực từ:</strong> 1 tháng 1, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Cam Kết Bảo Mật Của Chúng Tôi
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Bảo Mật Tối Đa
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Mã hóa end-to-end, tuân thủ tiêu chuẩn bảo mật quốc tế ISO 27001
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Minh Bạch Hoàn Toàn
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Công khai rõ ràng về việc thu thập, sử dụng và chia sẻ dữ liệu
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Quyền Kiểm Soát
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Bạn có quyền truy cập, chỉnh sửa và xóa dữ liệu cá nhân bất cứ lúc nào
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Mục Lục
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="#collection" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  1. Thu Thập Thông Tin
                </a>
                <a href="#usage" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  2. Sử Dụng Thông Tin
                </a>
                <a href="#sharing" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  3. Chia Sẻ Thông Tin
                </a>
                <a href="#security" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  4. Bảo Mật Dữ Liệu
                </a>
                <a href="#retention" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  5. Lưu Trữ Dữ Liệu
                </a>
              </div>
              <div className="space-y-2">
                <a href="#rights" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  6. Quyền Của Bạn
                </a>
                <a href="#cookies" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  7. Cookies và Tracking
                </a>
                <a href="#children" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  8. Quyền Riêng Tư Trẻ Em
                </a>
                <a href="#changes" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  9. Thay Đổi Chính Sách
                </a>
                <a href="#contact" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  10. Liên Hệ
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            
            {/* Section 1 */}
            <div id="collection" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  1. Thu Thập Thông Tin
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thông Tin Bạn Cung Cấp</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Thông tin tài khoản: tên, email, số điện thoại, địa chỉ</li>
                  <li>Thông tin doanh nghiệp: tên công ty, mã số thuế, ngành nghề kinh doanh</li>
                  <li>Thông tin thanh toán: thông tin thẻ tín dụng, tài khoản ngân hàng</li>
                  <li>Dữ liệu kinh doanh: sản phẩm, khách hàng, đơn hàng, báo cáo</li>
                  <li>Thông tin liên hệ: tin nhắn, email, cuộc gọi hỗ trợ</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thông Tin Thu Thập Tự Động</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Địa chỉ IP, thông tin thiết bị, hệ điều hành, trình duyệt</li>
                  <li>Nhật ký hoạt động: thời gian đăng nhập, tính năng sử dụng</li>
                  <li>Cookies và local storage để cải thiện trải nghiệm</li>
                  <li>Dữ liệu phân tích: thống kê sử dụng, hiệu suất hệ thống</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thông Tin Từ Bên Thứ Ba</h3>
                <p>
                  Chúng tôi có thể nhận thông tin từ các đối tác thanh toán, 
                  dịch vụ xác thực danh tính và các API tích hợp khác để cung cấp dịch vụ tốt hơn.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="usage" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  2. Sử Dụng Thông Tin
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:</p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cung Cấp Dịch Vụ</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Xử lý đăng ký tài khoản và xác thực người dùng</li>
                  <li>Cung cấp các tính năng quản lý bán hàng</li>
                  <li>Xử lý thanh toán và lập hóa đơn</li>
                  <li>Backup và phục hồi dữ liệu</li>
                  <li>Hỗ trợ kỹ thuật và chăm sóc khách hàng</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cải Thiện Dịch Vụ</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Phân tích cách sử dụng để tối ưu hóa tính năng</li>
                  <li>Phát triển tính năng mới dựa trên nhu cầu khách hàng</li>
                  <li>Giám sát hiệu suất và khắc phục sự cố</li>
                  <li>Thực hiện nghiên cứu và phân tích thị trường</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Liên Lạc</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Gửi thông báo quan trọng về dịch vụ</li>
                  <li>Cung cấp hỗ trợ kỹ thuật</li>
                  <li>Gửi newsletter và thông tin sản phẩm (nếu đồng ý)</li>
                  <li>Tiến hành khảo sát hài lòng khách hàng</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div id="sharing" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  3. Chia Sẻ Thông Tin
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">
                  Chúng tôi <strong>KHÔNG bán</strong> thông tin cá nhân của bạn cho bên thứ ba. 
                  Thông tin chỉ được chia sẻ trong các trường hợp sau:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nhà Cung Cấp Dịch Vụ</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Dịch vụ cloud hosting (AWS, Google Cloud)</li>
                  <li>Nhà cung cấp dịch vụ thanh toán (Stripe, PayPal)</li>
                  <li>Dịch vụ email marketing (với sự đồng ý của bạn)</li>
                  <li>Dịch vụ phân tích và monitoring</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Yêu Cầu Pháp Lý</h3>
                <p className="mb-4">
                  Khi được yêu cầu bởi cơ quan có thẩm quyền theo quy định pháp luật Việt Nam 
                  hoặc để bảo vệ quyền lợi hợp pháp của chúng tôi và người dùng khác.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sáp Nhập và Mua Lại</h3>
                <p>
                  Trong trường hợp công ty được sáp nhập hoặc mua lại, 
                  thông tin khách hàng có thể được chuyển giao với các biện pháp bảo vệ tương tự.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div id="security" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  4. Bảo Mật Dữ Liệu
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Biện Pháp Kỹ Thuật</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Mã hóa AES-256 cho dữ liệu lưu trữ</li>
                  <li>TLS 1.3 cho việc truyền tải dữ liệu</li>
                  <li>Xác thực hai yếu tố (2FA)</li>
                  <li>Phân quyền truy cập dựa trên vai trò (RBAC)</li>
                  <li>Giám sát và phát hiện xâm nhập thường xuyên</li>
                  <li>Backup tự động và disaster recovery</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Biện Pháp Tổ Chức</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Đào tạo nhân viên về bảo mật thông tin</li>
                  <li>Kiểm soát truy cập vật lý vào data center</li>
                  <li>Thỏa thuận bảo mật với tất cả nhà cung cấp</li>
                  <li>Audit bảo mật định kỳ bởi bên thứ ba</li>
                  <li>Kế hoạch ứng phó sự cố bảo mật</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tuân Thủ Tiêu Chuẩn</h3>
                <p>
                  Hệ thống của chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế: 
                  ISO 27001, SOC 2 Type II, và các quy định về bảo vệ dữ liệu cá nhân của Việt Nam.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div id="retention" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  5. Lưu Trữ Dữ Liệu
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thời Gian Lưu Trữ</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Dữ liệu tài khoản:</strong> Trong suốt thời gian sử dụng dịch vụ + 90 ngày sau khi chấm dứt</li>
                  <li><strong>Dữ liệu kinh doanh:</strong> Tùy theo lựa chọn của bạn, tối đa 7 năm theo quy định kế toán</li>
                  <li><strong>Nhật ký hệ thống:</strong> 12 tháng để phục vụ troubleshooting</li>
                  <li><strong>Dữ liệu thanh toán:</strong> 5 năm theo quy định pháp luật về kế toán</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Vị Trí Lưu Trữ</h3>
                <p className="mb-4">
                  Dữ liệu của bạn được lưu trữ tại các data center có chứng nhận bảo mật 
                  tại Singapore và Việt Nam, đảm bảo tuân thủ quy định về lưu trữ dữ liệu trong nước.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Xóa Dữ Liệu</h3>
                <p>
                  Khi hết thời gian lưu trữ hoặc theo yêu cầu của bạn, 
                  dữ liệu sẽ được xóa vĩnh viễn bằng phương pháp secure deletion không thể khôi phục.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div id="rights" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  6. Quyền Của Bạn
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-600" />
                      Quyền Truy Cập
                    </h3>
                    <p className="text-sm mb-3">
                      Yêu cầu xem và tải xuống bản sao dữ liệu cá nhân của bạn
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-green-600" />
                      Quyền Chỉnh Sửa
                    </h3>
                    <p className="text-sm mb-3">
                      Cập nhật hoặc sửa đổi thông tin cá nhân không chính xác
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                      Quyền Xóa
                    </h3>
                    <p className="text-sm mb-3">
                      Yêu cầu xóa dữ liệu cá nhân trong một số trường hợp nhất định
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Download className="w-5 h-5 mr-2 text-purple-600" />
                      Quyền Di Chuyển
                    </h3>
                    <p className="text-sm mb-3">
                      Yêu cầu xuất dữ liệu sang định dạng có thể đọc được
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cách Thực Hiện Quyền
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Liên hệ với chúng tôi qua email <strong>privacy@giakiemso.com</strong> hoặc 
                    sử dụng tính năng quản lý dữ liệu trong tài khoản của bạn. 
                    Chúng tôi sẽ phản hồi trong vòng 30 ngày.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Quản Lý Quyền Riêng Tư
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Kiểm soát dữ liệu cá nhân của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Download className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tải Dữ Liệu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Tải xuống bản sao đầy đủ dữ liệu của bạn
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Yêu Cầu Tải Xuống
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Settings className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Cài Đặt Quyền Riêng Tư
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Quản lý preferences và permissions
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Mở Cài Đặt
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Báo Cáo Sự Cố
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Báo cáo vi phạm bảo mật hoặc quyền riêng tư
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Báo Cáo Ngay
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Có Thắc Mắc Về Quyền Riêng Tư?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Đội ngũ bảo mật và quyền riêng tư của chúng tôi sẵn sàng hỗ trợ bạn
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:privacy@giakiemso.com">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Email: privacy@giakiemso.com
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Liên Hệ Tổng Đài
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Cam kết:</strong> Chúng tôi sẽ phản hồi mọi yêu cầu về quyền riêng tư trong vòng 30 ngày làm việc. 
              Đối với các sự cố bảo mật nghiêm trọng, chúng tôi sẽ phản hồi trong vòng 72 giờ.
            </p>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
