import Header from "@/components/site-header";
import Footer from "@/components/site-footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Tiện ích
              <span className="bg-gradient-to-r from-brand to-emerald-600 bg-clip-text text-transparent"> Văn phòng</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Hệ thống module tiện ích toàn diện, hiện đại và linh hoạt cho doanh nghiệp. 
              Tự động hóa công việc, tối ưu hiệu suất với kiến trúc module mở.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/admin/modules"
                className="inline-flex items-center px-8 py-4 bg-brand text-brand-foreground font-semibold rounded-lg hover:bg-brand/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🚀 Bắt đầu ngay
              </Link>
              <Link 
                href="/tools/tax-calculator"
                className="inline-flex items-center px-8 py-4 bg-background text-foreground font-semibold rounded-lg border-2 border-border hover:bg-accent transform hover:scale-105 transition-all duration-200"
              >
                🧮 Dùng thử
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Hiện đại</h3>
                <p className="text-muted-foreground">Được xây dựng với công nghệ tiên tiến nhất: Next.js, TypeScript, Tailwind CSS</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Linh hoạt</h3>
                <p className="text-muted-foreground">Kiến trúc module mở, dễ dàng mở rộng và tùy chỉnh theo nhu cầu</p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Bảo mật</h3>
                <p className="text-muted-foreground">Hệ thống bảo mật đa lớp với kiểm soát quyền truy cập chi tiết</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hệ thống được thiết kế để đáp ứng mọi nhu cầu của doanh nghiệp hiện đại
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">🧮</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Tính thuế TNCN</h3>
              <p className="text-muted-foreground mb-4">Tính toán thuế thu nhập cá nhân chính xác theo quy định mới nhất</p>
              <Link href="/tools/tax-calculator" className="text-brand hover:underline font-medium">
                Dùng ngay →
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">📱</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Tạo mã QR</h3>
              <p className="text-muted-foreground mb-4">Tạo mã QR cho text, URL, email với nhiều tùy chỉnh</p>
              <Link href="/tools/qr-generator-v2" className="text-brand hover:underline font-medium">
                Dùng ngay →
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">🔄</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Chuyển đổi văn bản</h3>
              <p className="text-muted-foreground mb-4">Chuyển đổi định dạng văn bản, mã hóa, làm sạch dữ liệu</p>
              <Link href="/admin/modules" className="text-brand hover:underline font-medium">
                Xem thêm →
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">⚙️</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Quản lý Module</h3>
              <p className="text-muted-foreground mb-4">Hệ thống quản lý module tự động với marketplace tích hợp</p>
              <Link href="/admin/modules" className="text-brand hover:underline font-medium">
                Quản lý →
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">🛠️</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Dev Tools</h3>
              <p className="text-muted-foreground mb-4">Công cụ phát triển và debug cho developers</p>
              <Link href="/admin/dev-tools" className="text-brand hover:underline font-medium">
                Khám phá →
              </Link>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">🎨</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Giao diện hiện đại</h3>
              <p className="text-muted-foreground mb-4">Dark/Light mode, responsive design, accessibility</p>
              <span className="text-brand font-medium">Đã tích hợp ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Module Marketplace</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Khám phá và cài đặt các module tiện ích được xây dựng sẵn
            </p>
          </div>
          
          <div className="text-center">
            <Link 
              href="/admin/modules"
              className="inline-flex items-center px-8 py-4 bg-brand text-brand-foreground font-semibold rounded-lg hover:bg-brand/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              📦 Xem tất cả Module
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
