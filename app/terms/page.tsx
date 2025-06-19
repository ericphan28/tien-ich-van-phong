import { LandingLayout } from "@/components/layout/landing-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Scale,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Điều Khoản{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sử Dụng
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Các điều khoản và điều kiện sử dụng dịch vụ Gia Kiệm Số. 
              Vui lòng đọc kỹ trước khi sử dụng hệ thống.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Cập nhật lần cuối:</strong> 15 tháng 1, 2025<br />
                <strong>Hiệu lực từ:</strong> 1 tháng 1, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Mục Lục
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="#acceptance" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  1. Chấp Nhận Điều Khoản
                </a>
                <a href="#services" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  2. Mô Tả Dịch Vụ
                </a>
                <a href="#account" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  3. Tài Khoản Người Dùng
                </a>
                <a href="#payment" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  4. Thanh Toán và Phí
                </a>
                <a href="#data" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  5. Dữ Liệu và Bảo Mật
                </a>
              </div>
              <div className="space-y-2">
                <a href="#prohibited" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  6. Hoạt Động Bị Cấm
                </a>
                <a href="#liability" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  7. Trách Nhiệm Pháp Lý
                </a>
                <a href="#termination" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  8. Chấm Dứt Dịch Vụ
                </a>
                <a href="#governing" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  9. Luật Áp Dụng
                </a>
                <a href="#contact" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  10. Liên Hệ
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
            
            {/* Section 1 */}
            <div id="acceptance" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  1. Chấp Nhận Điều Khoản
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">
                  Bằng việc truy cập và sử dụng dịch vụ Gia Kiệm Số (&ldquo;Dịch vụ&rdquo;), bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này (&ldquo;Điều khoản&rdquo;). Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không được sử dụng Dịch vụ.
                </p>
                <p>
                  Chúng tôi có quyền thay đổi các Điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng Dịch vụ sau khi các thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các Điều khoản đã được sửa đổi.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="services" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  2. Mô Tả Dịch Vụ
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">
                  Gia Kiệm Số cung cấp hệ thống quản lý bán hàng đa cửa hàng (multi-tenant) bao gồm nhưng không giới hạn:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Hệ thống Point of Sale (POS)</li>
                  <li>Quản lý kho hàng và tồn kho</li>
                  <li>Quản lý khách hàng và chương trình khuyến mãi</li>
                  <li>Báo cáo và phân tích doanh số</li>
                  <li>Tích hợp thanh toán và e-commerce</li>
                  <li>Hỗ trợ đa chi nhánh và phân quyền nhân viên</li>
                </ul>
                <p>
                  Chúng tôi cam kết cung cấp dịch vụ với độ tin cậy cao (99.9% uptime) và bảo mật thông tin khách hàng theo tiêu chuẩn quốc tế.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div id="account" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  3. Tài Khoản Người Dùng
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Đăng Ký Tài Khoản</h3>
                <p className="mb-4">
                  Để sử dụng Dịch vụ, bạn phải tạo tài khoản và cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và tất cả hoạt động diễn ra dưới tài khoản của bạn.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Yêu Cầu Tài Khoản</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Bạn phải từ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ hợp pháp</li>
                  <li>Cung cấp thông tin liên hệ chính xác và có thể xác minh được</li>
                  <li>Không tạo nhiều tài khoản cho cùng một doanh nghiệp</li>
                  <li>Tuân thủ các quy định pháp luật Việt Nam về kinh doanh</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bảo Mật Tài Khoản</h3>
                <p>
                  Bạn cam kết không chia sẻ thông tin đăng nhập với bên thứ ba và thông báo ngay cho chúng tôi nếu phát hiện việc sử dụng tài khoản trái phép.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div id="payment" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  4. Thanh Toán và Phí
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Gói Dịch Vụ và Phí</h3>
                <p className="mb-4">
                  Chúng tôi cung cấp nhiều gói dịch vụ khác nhau. Phí dịch vụ được công bố rõ ràng trên website và có thể thay đổi theo thông báo trước 30 ngày.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Thanh Toán</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Thanh toán theo chu kỳ hàng tháng hoặc hàng năm</li>
                  <li>Các phương thức thanh toán được chấp nhận: thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử</li>
                  <li>Phí được tính trước và không hoàn lại (trừ trường hợp đặc biệt)</li>
                  <li>Tài khoản sẽ bị tạm ngưng nếu quá hạn thanh toán 7 ngày</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hoàn Tiền</h3>
                <p>
                  Chúng tôi cung cấp chính sách hoàn tiền trong vòng 7 ngày đầu sử dụng đối với khách hàng lần đầu, với điều kiện chưa sử dụng quá 50% tính năng có sẵn.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div id="data" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  5. Dữ Liệu và Bảo Mật
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quyền Sở Hữu Dữ Liệu</h3>
                <p className="mb-4">
                  Bạn giữ quyền sở hữu hoàn toàn đối với dữ liệu của mình. Chúng tôi chỉ xử lý dữ liệu theo hướng dẫn của bạn và để cung cấp Dịch vụ.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bảo Mật Dữ Liệu</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Mã hóa dữ liệu end-to-end</li>
                  <li>Backup tự động hàng ngày</li>
                  <li>Phân quyền truy cập dựa trên vai trò (RBAC)</li>
                  <li>Giám sát bảo mật thường xuyên</li>
                  <li>Tuân thủ tiêu chuẩn ISO 27001</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Xuất Dữ Liệu</h3>
                <p>
                  Bạn có thể yêu cầu xuất dữ liệu của mình bất cứ lúc nào. Chúng tôi sẽ cung cấp dữ liệu dưới dạng có thể đọc được trong vòng 30 ngày.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div id="prohibited" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  6. Hoạt Động Bị Cấm
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">Bạn đồng ý không sử dụng Dịch vụ để:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Tham gia vào các hoạt động bất hợp pháp hoặc lừa đảo</li>
                  <li>Bán các sản phẩm bị cấm hoặc hạn chế theo pháp luật Việt Nam</li>
                  <li>Tấn công, hack hoặc làm gián đoạn hệ thống</li>
                  <li>Sử dụng thông tin của khách hàng khác mà không có sự đồng ý</li>
                  <li>Tạo ra hoặc phân phối virus, malware</li>
                  <li>Spam hoặc gửi email không mong muốn</li>
                  <li>Vi phạm quyền sở hữu trí tuệ của bên thứ ba</li>
                </ul>
                <p>
                  Vi phạm các quy định này có thể dẫn đến việc tạm ngưng hoặc chấm dứt tài khoản mà không cần thông báo trước.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div id="liability" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  7. Trách Nhiệm Pháp Lý
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Giới Hạn Trách Nhiệm</h3>
                <p className="mb-4">
                  Gia Kiệm Số cung cấp dịch vụ &ldquo;như hiện tại&rdquo; và không đưa ra bảo đảm nào về tính liên tục, độ chính xác hoặc không có lỗi của dịch vụ.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bồi Thường</h3>
                <p className="mb-4">
                  Trách nhiệm tối đa của chúng tôi đối với bất kỳ tổn thất nào không vượt quá số tiền bạn đã trả cho dịch vụ trong 12 tháng gần nhất.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Force Majeure</h3>
                <p>
                  Chúng tôi không chịu trách nhiệm cho việc gián đoạn dịch vụ do các sự kiện bất khả kháng như thiên tai, chiến tranh, dịch bệnh, sự cố hạ tầng internet, hoặc các quy định của chính phủ.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div id="termination" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  8. Chấm Dứt Dịch Vụ
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Chấm Dứt Bởi Khách Hàng</h3>
                <p className="mb-4">
                  Bạn có thể chấm dứt tài khoản bất cứ lúc nào bằng cách thông báo trước 30 ngày. Dữ liệu sẽ được lưu trữ thêm 90 ngày sau khi chấm dứt.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Chấm Dứt Bởi Gia Kiệm Số</h3>
                <p className="mb-4">
                  Chúng tôi có quyền chấm dứt tài khoản của bạn nếu:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Vi phạm các Điều khoản này</li>
                  <li>Không thanh toán phí dịch vụ trong 30 ngày</li>
                  <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  <li>Gây nguy hại đến hệ thống hoặc người dùng khác</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hiệu Lực Sau Chấm Dứt</h3>
                <p>
                  Các điều khoản về bảo mật, trách nhiệm pháp lý và giải quyết tranh chấp vẫn có hiệu lực sau khi chấm dứt dịch vụ.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div id="governing" className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  9. Luật Áp Dụng và Giải Quyết Tranh Chấp
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                <p className="mb-4">
                  Các Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại TP. Hồ Chí Minh.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Giải Quyết Tranh Chấp</h3>
                <p className="mb-4">
                  Trước khi khởi kiện, các bên cam kết thương lượng thiện chí trong vòng 60 ngày. Nếu không đạt được thỏa thuận, tranh chấp sẽ được giải quyết thông qua trung tài tại Trung tâm Trọng tài Quốc tế Việt Nam (VIAC).
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Có Câu Hỏi Về Điều Khoản?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Đội ngũ pháp lý của chúng tôi sẵn sàng giải đáp mọi thắc mắc
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Liên Hệ Pháp Lý
              </Button>
            </Link>
            <Link href="mailto:legal@giakiemso.com">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Email: legal@giakiemso.com
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Lưu ý:</strong> Đây là bản dịch tiếng Việt của Điều khoản Sử dụng. 
              Trong trường hợp có xung đột, bản tiếng Anh sẽ được ưu tiên áp dụng.
            </p>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
