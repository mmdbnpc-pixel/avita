import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Eye, Gem } from 'lucide-react';

const values = [
  { icon: Gem, title: 'کیفیت بی‌قصور', desc: 'هر قطعه با وسواس و با بالاترین استانداردهای کیفی تولید می‌شود.' },
  { icon: Heart, title: 'طراحی با عشق', desc: 'ما باور داریم که اکسسوری باید داستان بگوید و احساس منتقل کند.' },
  { icon: Eye, title: 'توجه به جزئیات', desc: 'جزئیات کوچک تفاوت بزرگ می‌سازند. این باور ماست.' },
  { icon: Sparkles, title: 'نوآوری مستمر', desc: 'همیشه در جستجوی طراحی‌های جدید و تجربه‌های بهتر هستیم.' },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden bg-navy-950">
        <img
          src="/pic-s/6.png"
          alt="AVITA VS Code"
          className="h-full w-full object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-navy-950 via-navy-950/60 to-transparent" />

        <div className="container-luxury absolute inset-0 flex flex-col justify-center">
          <h1 className="mt-6 text-4xl font-bold text-ivory-100 lg:text-5xl">
            داستان اویتا
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory-300">
            اویتا باور دارد که سبک شخصی، از جزئیات کوچک ساخته می‌شود.
          </p>
        </div>
      </section>
     


      {/* Brand Story */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 block text-sm text-gold-500">داستان ما</span>
              <h2 className="mb-6 text-3xl font-bold text-navy-900 lg:text-4xl">
                از عشق به جزئیات متولد شدیم
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                <p>
                  اویتا در سال ۱۴۰۰ با یک باور ساده آغاز شد: اکسسوری باید چیزی فراتر از یک تزئین باشد.
                  باید داستان شخصی شما را روایت کند و استایل شما را تعریف کند.
                </p>
                <p>
                  ما با ترکیب صنعت‌گری ایرانی و طراحی مدرن، اکسسوری‌هایی می‌سازیم که کیفیت، زیبایی و
                  ماندگاری را در خود دارند. هر قطعه با وسواس طراحی و تولید می‌شود تا سال‌ها همراه شما باشد.
                </p>
                <p>
                  امروز، اویتا به یکی از برندهای محبوب اکسسوری لوکس ایران تبدیل شده است و ما همچنان
                  به باور اولیه‌مان پایبندیم: جزئیات، تفاوت را می‌سازند.
                </p>
              </div>
            </div>
            <div className="relative">

            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-navy-950 py-16 lg:py-24">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 block text-sm text-gold-400">فلسفه برند</span>
            <h2 className="mb-6 text-3xl font-bold text-ivory-100 lg:text-4xl">
              «اویتا باور دارد که سبک شخصی، از جزئیات کوچک ساخته می‌شود.»
            </h2>
            <p className="text-base leading-relaxed text-ivory-300">
              ما برای کسانی طراحی می‌کنیم که جزئیات را می‌بینند. کسانی که می‌دانند یک ساعت، یک گردنبند
              یا یک کمربند می‌تواند تفاوت یک استایل معمولی و یک استایل ماندگار را بسازد.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-sm text-gold-500">ارزش‌های ما</span>
            <h2 className="text-3xl font-bold text-navy-900 lg:text-4xl">چرا اویتا؟</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div key={i} className="rounded-2xl border border-ivory-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-navy-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ivory-200/50 py-16 lg:py-24">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 block text-sm text-gold-500">ماموریت</span>
              <h2 className="mb-4 text-2xl font-bold text-navy-900">ماموریت ما</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                ارائه اکسسوری‌های لوکس با کیفیتی متمایز، که استایل شخصی هر فرد را تکمیل و تعریف کند.
                ما متعهد به نوآوری، کیفیت و تجربه خرید بی‌نظیر هستیم.
              </p>
            </div>
            <div>
              <span className="mb-3 block text-sm text-gold-500">چشم‌انداز</span>
              <h2 className="mb-4 text-2xl font-bold text-navy-900">چشم‌انداز ما</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                تبدیل شدن به برترین برند اکسسوری لوکس ایران و گسترش حضور بین‌المللی، با حفظ اصالت
                ایرانی و تعهد به کیفیت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury text-center">
          <h2 className="mb-6 text-3xl font-bold text-navy-900 lg:text-4xl">کالکشن اویتا را کشف کنید</h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-8 py-4 text-sm font-medium text-ivory-100 transition-colors hover:bg-navy-800"
          >
            مشاهده محصولات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
