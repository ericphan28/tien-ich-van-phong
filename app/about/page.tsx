import { LandingLayout } from "@/components/layout/landing-layout";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Về{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gia Kiệm Số
              </span>
            </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Tôi là một doanh nhân trẻ với niềm đam mê công nghệ, mong muốn tạo ra những giải pháp 
              đơn giản nhưng hiệu quả giúp các chủ cửa hàng quản lý kinh doanh dễ dàng hơn.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Sứ Mệnh
              </h3>              <p className="text-gray-600 dark:text-gray-300">
                Tạo ra những công cụ đơn giản, dễ sử dụng giúp các chủ cửa hàng 
                quản lý kinh doanh hiệu quả mà không cần kiến thức công nghệ phức tạp.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Tầm Nhìn
              </h3>              <p className="text-gray-600 dark:text-gray-300">
                Trở thành giải pháp tin cậy cho cộng đồng doanh nghiệp nhỏ, 
                giúp nhiều chủ cửa hàng phát triển kinh doanh bền vững.
              </p>
            </div>

            {/* Values */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Giá Trị Cốt Lõi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Đặt khách hàng làm trung tâm, liên tục đổi mới, 
                minh bạch trong hoạt động và chất lượng vượt trội.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Câu Chuyện Của Tôi
            </h2>
          </div>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">            <p className="text-lg leading-relaxed mb-6">
              Gia Kiệm Số ra đời từ trải nghiệm cá nhân của chúng tôi khi giúp gia đình quản lý cửa hàng nhỏ. 
              Chúng tôi nhận thấy rằng nhiều chủ cửa hàng vẫn đang quản lý bằng sổ sách thủ công, 
              dẫn đến nhiều sai sót và khó khăn trong việc theo dõi kinh doanh.
            </p>
              <p className="text-lg leading-relaxed mb-6">
              Với nền tảng lập trình và kinh nghiệm thực tế trong kinh doanh, 
              chúng tôi quyết định phát triển một hệ thống quản lý đơn giản, dễ sử dụng 
              và phù hợp với ngân sách của các cửa hàng nhỏ.
            </p>
              <p className="text-lg leading-relaxed">
              Hiện tại, chúng tôi đang liên tục phát triển và cải thiện Gia Kiệm Số 
              dựa trên phản hồi từ những chủ cửa hàng đầu tiên đã sử dụng hệ thống.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cam Kết Của Chúng Tôi
            </h2>
            <p className="text-xl text-blue-100">
              Những giá trị chúng tôi mang đến cho khách hàng
            </p>
          </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100">Tận tâm với khách hàng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-blue-100">Phản hồi nhanh chóng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0₫</div>
              <div className="text-blue-100">Chi phí setup</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-blue-100">Cải thiện liên tục</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Về Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Đội ngũ đứng sau Gia Kiệm Số
            </p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Founder & Team
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chúng tôi tự tay phát triển và duy trì hệ thống, đảm bảo chất lượng và sự tận tâm cao nhất
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Customer Success
              </h3>              <p className="text-gray-600 dark:text-gray-300">
                Chúng tôi trực tiếp hỗ trợ từng khách hàng, lắng nghe phản hồi và cải thiện sản phẩm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Bắt Đầu Hành Trình Số Hóa Cùng Chúng Tôi
          </h2>          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Hãy để chúng tôi giúp bạn quản lý cửa hàng hiệu quả hơn với công nghệ đơn giản và dễ sử dụng
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                Dùng Thử Miễn Phí
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Liên Hệ Tư Vấn
              </Button>
            </Link>
          </div>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            📍 D2/062A, Nam Sơn, Quang Trung, Thống Nhất, Đồng Nai
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
