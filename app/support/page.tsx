import { LandingLayout } from "@/components/layout/landing-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  BookOpen, 
  Video, 
  Download,
  Search,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Trung Tâm{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hỗ Trợ
              </span>
            </h1>            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Tìm câu trả lời nhanh chóng 
              hoặc liên hệ trực tiếp để được tư vấn chi tiết.
            </p>

            {/* Quick Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi, hướng dẫn, tính năng..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
                />
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Trực Tuyến
              </Button>
              <Link href="tel:19001234">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  <Phone className="w-5 h-5 mr-2" />
                  Hotline: 1900 1234
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Chọn Cách Hỗ Trợ Phù Hợp
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Nhiều kênh hỗ trợ để bạn lựa chọn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Live Chat */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Chat Trực Tuyến
              </h3>              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Kết nối ngay với chúng tôi để được hỗ trợ trong thời gian thực
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  Phản hồi ngay lập tức
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  Hỗ trợ đa ngôn ngữ
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Bắt Đầu Chat
              </Button>
            </Card>            {/* Zalo Support */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Hỗ Trợ Zalo
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Liên hệ qua Zalo để được hỗ trợ nhanh chóng và tiện lợi
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  Tư vấn cá nhân
                </div>                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  Phản hồi nhanh trong giờ hành chính
                </div>
              </div>
              <Link href="https://zalo.me/0907136029" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Chat Zalo: 0907136029
                </Button>
              </Link>
            </Card>

            {/* Email Support */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Hỗ Trợ Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Gửi email chi tiết cho các vấn đề cần hướng dẫn kỹ thuật
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Phản hồi trong 2h
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Hướng dẫn chi tiết
                </div>
              </div>              <Link href="mailto:ericphan28@gmail.com">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Gửi Email
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Tự Giải Quyết Nhanh Chóng
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Kho kiến thức phong phú với hướng dẫn chi tiết
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Documentation */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Hướng Dẫn Sử Dụng
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Tài liệu chi tiết về tất cả tính năng của hệ thống
              </p>
              <Link href="/docs" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center">
                Xem Hướng Dẫn <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Card>

            {/* Video Tutorials */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Video Hướng Dẫn
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Các video demo chi tiết từ cơ bản đến nâng cao
              </p>
              <Link href="/tutorials" className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline flex items-center">
                Xem Video <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Card>

            {/* Downloads */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tài Liệu Tải Về
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Template, checklist và tài liệu hỗ trợ
              </p>
              <Link href="/downloads" className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline flex items-center">
                Tải Xuống <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Card>

            {/* FAQ */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Câu Hỏi Thường Gặp
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Giải đáp các thắc mắc phổ biến từ khách hàng
              </p>
              <Link href="/faq" className="text-yellow-600 dark:text-yellow-400 text-sm font-medium hover:underline flex items-center">
                Xem FAQ <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Chủ Đề Phổ Biến
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Những vấn đề khách hàng quan tâm nhất
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Làm thế nào để bắt đầu sử dụng hệ thống?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hướng dẫn từng bước để thiết lập tài khoản và bắt đầu quản lý cửa hàng của bạn.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cách nhập dữ liệu sản phẩm hàng loạt?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hướng dẫn sử dụng tính năng import Excel để nhập hàng trăm sản phẩm cùng lúc.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Thiết lập báo cáo doanh thu theo thời gian thực?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Cách cấu hình dashboard để theo dõi doanh thu, lợi nhuận và các chỉ số KPI quan trọng.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tích hợp với website bán hàng online?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Kết nối hệ thống POS với website để đồng bộ kho hàng và đơn hàng online/offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Level Agreement */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Cam Kết Chất Lượng Dịch Vụ
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Chúng tôi cam kết cung cấp dịch vụ hỗ trợ tốt nhất
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime hệ thống</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">&lt; 2h</div>
              <div className="text-blue-100">Thời gian phản hồi</div>
            </div>            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">Nhanh</div>
              <div className="text-blue-100">Phản hồi khẩn cấp</div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Hỗ Trợ Khẩn Cấp
            </h2>            <p className="text-red-700 dark:text-red-300 mb-6">
              Nếu bạn gặp sự cố nghiêm trọng ảnh hưởng đến hoạt động kinh doanh, 
              vui lòng liên hệ ngay để được hỗ trợ ưu tiên
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://zalo.me/0907136029" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Zalo Khẩn Cấp: 0907136029
                </Button>
              </Link>
              <Link href="mailto:ericphan28@gmail.com">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 px-8 py-3"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Khẩn Cấp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
