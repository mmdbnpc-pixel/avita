import { Link } from 'react-router-dom';
import { Instagram, Send, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { to: '/', label: 'صفحه اصلی' },
  { to: '/products', label: 'فروشگاه' },
  { to: '/about', label: 'درباره ما' },
  { to: '/articles', label: 'مقالات' },
  // نکته: مقدار to برای تماس با ما قبلاً /cart بود، اگر اشتباه تایپی است آن را به /contact تغییر دهید.
  { to: '/Support ', label: 'پشتیبانی' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-ivory-200" dir="rtl">
      {/* کاهش py-16 به py-10 و md:py-12 */}
      <div className="container-luxury px-6 py-10 sm:px-8 md:py-12 lg:px-10">

        {/* ================= MAIN FOOTER ================= */}
        {/* کاهش gap-14 و lg:gap-20 به gap-8 و lg:gap-10 */}
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-10">

          {/* ================= BRAND ================= */}
          <div className="flex flex-col items-center text-center">

            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl font-bold tracking-[0.2em] text-ivory-100">
                AVITA
              </span>

              <span className="text-sm font-medium text-gold-400">
                اویتا
              </span>
            </div>

            {/* کاهش leading-7 به leading-6 */}
            <p className="mx-auto max-w-md text-sm leading-6 text-ivory-300">
              اویتا، برند اکسسوری لوکس ایرانی. اکسسوری‌هایی با کیفیتی
              متمایز برای استایل متفاوت شما.
            </p>

            {/* Social Media */}
            {/* کاهش mt-7 به mt-5 و سایز آیکون‌ها به h-10 w-10 */}

          </div>

          {/* ================= QUICK LINKS ================= */}
          <div className="flex flex-col items-center text-center">

            {/* کاهش mb-7 pb-3 به mb-4 pb-2 */}
            <h4 className="relative mb-4 pb-2 text-sm font-semibold text-ivory-100">
              دسترسی سریع
              <span className="absolute bottom-0 left-1/2 h-px w-8 -translate-x-1/2 bg-gold-400" />
            </h4>

            {/* کاهش gap-4 به gap-3 */}
            <ul className="flex flex-col items-center gap-3">
              {quickLinks.map((link, i) => (
                <li key={i} className="text-center">
                  <Link
                    to={link.to}
                    className="inline-block text-sm text-ivory-300 transition-all duration-300 hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div className="flex flex-col items-center text-center">

            {/* کاهش mb-7 pb-3 به mb-4 pb-2 */}
            <h4 className="relative mb-4 pb-2 text-sm font-semibold text-ivory-100">
              تماس با ما
              <span className="absolute bottom-0 left-1/2 h-px w-8 -translate-x-1/2 bg-gold-400" />
            </h4>

            {/* کاهش gap-5 به gap-3 و leading-6 به leading-5 */}
            <ul className="flex flex-col items-center gap-3">

              <li className="flex items-center justify-center text-sm text-ivory-300">
                <a
                  href="tel:09046184216"
                  className="flex items-center justify-center gap-3 transition-colors hover:text-gold-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" />
                  <span>09046184216</span>
                </a>
              </li>

              <li className="flex items-center justify-center gap-3 text-sm text-ivory-300">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" />
                <span>avita.acc.ss@gmail.com</span>
              </li>

              <li className="flex max-w-xs items-center justify-center gap-3 text-sm leading-5 text-ivory-300">
                <MapPin className="h-4 w-4 shrink-0 text-gold-400" />
                <span>
                  قم / اکسسوری اویتا
                </span>
              </li>

            </ul>
          </div>
        </div>

        {/* ================= BOTTOM FOOTER ================= */}
        {/* کاهش mt-14 pt-8 به mt-8 pt-6 */}
        <div className="mt-8 border-t border-navy-800 pt-6">

          <div className="flex flex-col items-center justify-center gap-3 text-center">

            {/* Modernito */}
            <a
              href="https://modernitoweb.ir/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs leading-5 text-ivory-400 transition-colors duration-300 hover:text-gold-400"
            >
              طراحی و توسعه توسط مدرنیتو
            </a>

            {/* Divider */}
            <span className="h-px w-8 bg-navy-700" />

            {/* Copyright */}
            <p className="text-xs leading-5 text-ivory-400">
              © AVITA — تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}