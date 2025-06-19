import { LandingLayout } from "@/components/layout/landing-layout";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ContactPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Liên Hệ{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Với Chúng Tôi
              </span>
            </h1>            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. 
              Hãy liên hệ để được tư vấn miễn phí về giải pháp chuyển đổi số phù hợp nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Thông Tin Liên Hệ
              </h2>
              
              <div className="space-y-6">                {/* Zalo */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Zalo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <a href="https://zalo.me/0907136029" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                        0907136029
                      </a>
                    </p>                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phản hồi nhanh trong giờ hành chính
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      <a href="mailto:ericphan28@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                        ericphan28@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phản hồi trong vòng 2 giờ
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Địa Chỉ
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      D2/062A, Nam Sơn<br />
                      Quang Trung, Thống Nhất<br />
                      Đồng Nai, Việt Nam
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hỗ trợ tại chỗ theo lịch hẹn
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Giờ Làm Việc
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-1">
                      Thứ 2 - Thứ 6: 8:00 - 18:00
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      Thứ 7: 8:00 - 12:00
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chủ nhật: Nghỉ (trừ trường hợp khẩn cấp)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Gửi Tin Nhắn
                </h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Họ và tên lót
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Nhập họ tên"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tên
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Nhập tên"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0123 456 789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tên công ty/cửa hàng
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Tên doanh nghiệp của bạn"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chủ đề *
                    </Label>
                    <select
                      id="subject"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="demo">Yêu cầu demo sản phẩm</option>
                      <option value="pricing">Tư vấn gói dịch vụ</option>
                      <option value="support">Hỗ trợ kỹ thuật</option>
                      <option value="partnership">Hợp tác kinh doanh</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tin nhắn *
                    </Label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Mô tả chi tiết nhu cầu của bạn..."
                      className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Gửi Tin Nhắn
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Những thông tin cần thiết trước khi liên hệ
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Thời gian phản hồi thông thường là bao lâu?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chúng tôi cam kết phản hồi email trong vòng 2 giờ làm việc. 
                Đối với hotline, bạn sẽ được kết nối ngay lập tức.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tôi có thể được demo sản phẩm miễn phí không?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Có, chúng tôi cung cấp demo 1-1 hoàn toàn miễn phí cho tất cả khách hàng quan tâm. 
                Vui lòng đặt lịch qua form liên hệ hoặc gọi hotline.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Có hỗ trợ triển khai tại chỗ không?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Có, đội ngũ của chúng tôi sẽ hỗ trợ triển khai và đào tạo tại cửa hàng 
                cho các gói dịch vụ Premium và Enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Không Tìm Thấy Câu Trả Lời?
          </h2>          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Chúng tôi luôn sẵn sàng hỗ trợ và phản hồi nhanh chóng mọi câu hỏi của bạn
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                <MessageCircle className="w-5 h-5 mr-2" />
                Trò Chuyện Trực Tuyến
              </Button>
            </Link>
            <Link href="tel:19001234">
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Phone className="w-5 h-5 mr-2" />
                Gọi Ngay: 1900 1234
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
