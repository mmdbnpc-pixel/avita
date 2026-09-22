import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Eye, Gem } from 'lucide-react';

const values = [
  {
    icon: Gem,
    title: 'انتخاب باکیفیت',
    desc: 'ما مجموعه‌ای از اکسسوری‌های باکیفیت و جذاب را با دقت انتخاب می‌کنیم تا تجربه‌ای مطمئن از خرید داشته باشید.',
  },
  {
    icon: Heart,
    title: 'انتخاب برای سلیقه شما',
    desc: 'تنوع محصولات اویتا به شما کمک می‌کند اکسسوری متناسب با استایل و سلیقه شخصی خود را پیدا کنید.',
  },
  {
    icon: Eye,
    title: 'توجه به جزئیات',
    desc: 'از انتخاب محصولات تا ارائه و بسته‌بندی، تلاش می‌کنیم جزئیات تجربه خرید برای شما متفاوت باشد.',
  },
  {
    icon: Sparkles,
    title: 'تازه و به‌روز',
    desc: 'همیشه به دنبال مدل‌ها و اکسسوری‌های جدید و ترند هستیم تا انتخاب‌های متنوع‌تری در اختیار شما قرار دهیم.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden bg-navy-950">
        <img
          src="/pic-s/6.webp"
          alt="AVITA"
          className="h-full w-full object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-navy-950 via-navy-950/60 to-transparent" />

        <div className="container-luxury absolute inset-0 flex flex-col justify-center">
          <h1 className="mt-6 text-4xl font-bold text-ivory-100 lg:text-5xl">
            داستان اویتا
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory-300">
            اویتا یک فروشگاه آنلاین اکسسوری است؛ جایی برای پیدا کردن
            اکسسوری‌های شیک، کاربردی و متناسب با سبک شخصی شما.
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
                جایی برای انتخاب اکسسوری‌های خاص
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                <p>
                  اویتا با یک ایده ساده شکل گرفت؛ ایجاد یک تجربه متفاوت برای
                  خرید آنلاین اکسسوری. جایی که بتوانید بدون پیچیدگی، محصولات
                  مورد علاقه‌تان را پیدا و با خیال راحت انتخاب کنید.
                </p>

                <p>
                  ما مجموعه‌ای از اکسسوری‌های زنانه و مردانه را از میان مدل‌های
                  متنوع انتخاب می‌کنیم تا بتوانید محصولی متناسب با استایل،
                  سلیقه و نیاز خود پیدا کنید.
                </p>

                <p>
                  برای ما خرید اکسسوری فقط انتخاب یک محصول نیست؛ بلکه بخشی از
                  ساختن استایل شخصی شماست. به همین دلیل تلاش می‌کنیم در کنار
                  تنوع محصولات، تجربه‌ای ساده، مطمئن و لذت‌بخش از خرید آنلاین
                  برای شما فراهم کنیم.
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
            <span className="mb-3 block text-sm text-gold-400">
              فلسفه اویتا
            </span>

            <h2 className="mb-6 text-3xl font-bold text-ivory-100 lg:text-4xl">
              «استایل شخصی، از انتخاب‌های کوچک ساخته می‌شود.»
            </h2>

            <p className="text-base leading-relaxed text-ivory-300">
              ما باور داریم یک اکسسوری می‌تواند ظاهر یک استایل را کامل کند.
              اویتا تلاش می‌کند مجموعه‌ای متنوع از اکسسوری‌های زنانه و مردانه
              را در اختیار شما قرار دهد تا بتوانید انتخابی متناسب با شخصیت و
              سبک خود داشته باشید.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-sm text-gold-500">
              ارزش‌های ما
            </span>

            <h2 className="text-3xl font-bold text-navy-900 lg:text-4xl">
              چرا اویتا؟
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ivory-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                  <value.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-base font-semibold text-navy-900">
                  {value.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-500">
                  {value.desc}
                </p>
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
              <span className="mb-3 block text-sm text-gold-500">
                ماموریت
              </span>

              <h2 className="mb-4 text-2xl font-bold text-navy-900">
                ماموریت ما
              </h2>

              <p className="text-sm leading-relaxed text-gray-600">
                فراهم کردن مجموعه‌ای متنوع از اکسسوری‌های باکیفیت و جذاب و
                ایجاد یک تجربه خرید آنلاین ساده، مطمئن و لذت‌بخش برای مشتریان.
                هدف ما این است که هر فرد بتواند اکسسوری مورد علاقه خود را
                متناسب با استایل و سلیقه شخصی‌اش پیدا کند.
              </p>
            </div>

            <div>
              <span className="mb-3 block text-sm text-gold-500">
                چشم‌انداز
              </span>

              <h2 className="mb-4 text-2xl font-bold text-navy-900">
                چشم‌انداز ما
              </h2>

              <p className="text-sm leading-relaxed text-gray-600">
                تبدیل شدن به یک مقصد آنلاین قابل اعتماد برای خرید اکسسوری،
                با تمرکز بر تنوع محصولات، تجربه کاربری مناسب، کیفیت انتخاب‌ها
                و ایجاد ارتباطی ماندگار با مشتریان.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury text-center">
          <h2 className="mb-6 text-3xl font-bold text-navy-900 lg:text-4xl">
            اکسسوری مورد علاقه‌تان را پیدا کنید
          </h2>

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