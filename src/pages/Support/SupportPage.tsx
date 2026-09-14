
import { useState } from 'react';
import {
    ChevronDown,
    Headphones,
} from 'lucide-react';

const faqs = [
    {
        question: 'چگونه می‌توانم سفارش خود را پیگیری کنم؟',
        answer:
            'برای پیگیری سفارش، وارد حساب کاربری خود شوید و از بخش «تاریخچه سفارش‌ها» وضعیت سفارش خود را مشاهده کنید.',
    },
    {
        question: 'چقدر زمان برای ارسال سفارش نیاز است؟',
        answer:
            'زمان ارسال با توجه به مقصد و شرایط سفارش متفاوت است. وضعیت سفارش و اطلاعات ارسال از طریق حساب کاربری قابل مشاهده است.',
    },
    {
        question: 'آیا امکان لغو یا تغییر سفارش وجود دارد؟',
        answer:
            'در صورتی که سفارش هنوز وارد مرحله ارسال نشده باشد، می‌توانید برای بررسی امکان تغییر یا لغو سفارش با پشتیبانی ارتباط بگیرید.',
    },
    {
        question: 'چگونه می‌توانم محصولی را مرجوع کنم؟',
        answer:
            'برای درخواست مرجوعی، ابتدا با پشتیبانی ارتباط بگیرید تا شرایط سفارش شما بررسی و مراحل لازم اعلام شود.',
    },
    {
        question: 'چگونه اطلاعات حساب کاربری خود را تغییر دهم؟',
        answer:
            'پس از ورود به حساب کاربری، می‌توانید اطلاعات تکمیلی خود را از بخش حساب کاربری مشاهده و ویرایش کنید.',
    },
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitted(true);

        setFormData({
            name: '',
            phone: '',
            subject: '',
            message: '',
        });

        setTimeout(() => {
            setSubmitted(false);
        }, 4000);
    };

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-white text-navy-950 pt-20"
        >
            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden bg-navy-950">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950 to-navy-900" />

                <div className="relative container-luxury px-6 py-20 sm:px-8 md:py-24 lg:px-10">
                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                            <Headphones className="h-6 w-6 text-white" />
                        </div>

                        <p className="mb-3 text-xs font-medium tracking-[0.2em] text-blue-300">
                            AVITA SUPPORT
                        </p>

                        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                            پشتیبانی اویتا
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                            ما اینجا هستیم تا تجربه‌ای بهتر و ساده‌تر از خرید
                            اکسسوری برای شما فراهم کنیم. اگر سوال یا مشکلی دارید،
                            با ما در ارتباط باشید.
                        </p>
                    </div>
                </div>
            </section>


            {/* ========================================================= */}
            {/* LIGHT BACKGROUND AREA */}
            {/* CONTACT + FAQ */}
            {/* ========================================================= */}

            <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/60">

                {/* ===================================================== */}
                {/* GLOBAL SOFT BACKGROUND SHAPES */}
                {/* ===================================================== */}

                <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl" />

                <div className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-blue-50/60 blur-3xl" />


                {/* ===================================================== */}
                {/* CONTACT / SUPPORT BANNER */}
                {/* ===================================================== */}

                <section
                    dir="rtl"
                    className="relative overflow-hidden px-6 py-16 sm:py-20"
                >
                    <div className="container-luxury relative">

                        <div
                            className="
                                relative mx-auto max-w-6xl
                                overflow-hidden
                                rounded-[2.5rem]
                                border border-slate-200/80
                                bg-white
                                shadow-[0_25px_80px_rgba(15,23,42,0.10)]
                            "
                        >

                            {/* Decorative Bottom Line */}
                            <div
                                className="
                                    absolute bottom-10 left-10 right-10
                                    h-px
                                    bg-gradient-to-l
                                    from-transparent
                                    via-blue-200
                                    to-transparent
                                "
                            />

                            <div
                                className="
                                    grid items-center gap-10
                                    p-7
                                    sm:p-10
                                    md:grid-cols-2
                                    md:p-14
                                    lg:p-16
                                "
                            >

                                {/* ================================================= */}
                                {/* TEXT */}
                                {/* ================================================= */}

                                <div className="relative z-10 text-center md:text-right">

                                    {/* Small Label */}
                                    <div className="mb-6 flex items-center justify-center gap-3 md:justify-start">
                                        <span className="text-[11px] font-medium tracking-[0.35em] text-blue-400">
                                            SUPPORT
                                        </span>

                                        <span className="h-px w-16 bg-blue-200" />
                                    </div>


                                    {/* Title */}
                                    <h2
                                        className="
                                            mb-6
                                            text-3xl
                                            font-bold
                                            leading-[1.5]
                                            text-navy-950
                                            sm:text-4xl
                                            lg:text-5xl
                                        "
                                    >
                                        ارتباط با
                                        <span className="block text-blue-900">
                                            پشتیبانی اویتا
                                        </span>
                                    </h2>


                                    {/* Description */}
                                    <p
                                        className="
                                            mx-auto
                                            max-w-xl
                                            text-sm
                                            leading-8
                                            text-slate-500
                                            sm:text-base
                                            md:mx-0
                                        "
                                    >
                                        اگر درباره محصولات، نحوه ثبت سفارش،
                                        وضعیت ارسال یا هر بخش دیگری از فروشگاه
                                        سوالی دارید، تیم پشتیبانی اویتا آماده
                                        پاسخگویی به شماست.
                                    </p>

                                    <p
                                        className="
                                            mx-auto
                                            mt-3
                                            max-w-xl
                                            text-sm
                                            leading-7
                                            text-slate-400
                                            md:mx-0
                                        "
                                    >
                                        برای دریافت راهنمایی سریع‌تر، کافی است
                                        از طریق واتساپ با ما در ارتباط باشید.
                                        کارشناسان ما در کوتاه‌ترین زمان ممکن
                                        پاسخگوی شما خواهند بود.
                                    </p>


                                    {/* WhatsApp Button */}
                                    <div className="mt-8 flex justify-center md:justify-start">
                                        <a
                                            href="https://wa.me/message/6JH4LAKY3KP7B1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
        group
        inline-flex
        items-center
        gap-3
        rounded-full
        bg-navy-950
        px-6
        py-3.5
        text-sm
        font-medium
        text-white
        shadow-lg
        shadow-navy-950/10
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
    "
                                        >
                                            <span>شروع گفتگو در واتساپ</span>

                                            <span
                                                className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/10
            transition-transform
            duration-300
            group-hover:-translate-x-1
        "
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                >
                                                    <path
                                                        d="M5 12h13M13 6l6 6-6 6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </a>
                                    </div>
                                </div>


                                {/* ================================================= */}
                                {/* VISUAL */}
                                {/* ================================================= */}

                                <div
                                    className="
                                        relative
                                        flex
                                        min-h-[300px]
                                        items-center
                                        justify-center
                                        md:min-h-[360px]
                                    "
                                >

                                    {/* Main Soft Card */}
                                    <div
                                        className="
                                            relative
                                            flex
                                            h-[250px]
                                            w-full
                                            max-w-[430px]
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-[2rem]
                                            border
                                            border-blue-100
                                            bg-gradient-to-br
                                            from-blue-50
                                            via-white
                                            to-slate-100
                                            shadow-inner
                                        "
                                    >

                                        {/* Decorative Circle */}
                                        <div
                                            className="
                                                absolute
                                                -right-20
                                                -top-20
                                                h-52
                                                w-52
                                                rounded-full
                                                bg-white/80
                                            "
                                        />

                                        <div
                                            className="
                                                absolute
                                                -bottom-24
                                                -left-16
                                                h-60
                                                w-60
                                                rounded-full
                                                bg-blue-100/40
                                            "
                                        />


                                        {/* Decorative Wave */}
                                        <svg
                                            className="
                                                absolute
                                                bottom-0
                                                left-0
                                                w-full
                                                opacity-60
                                            "
                                            viewBox="0 0 500 100"
                                            preserveAspectRatio="none"
                                        >
                                            <path
                                                d="M0 65 C100 20, 170 90, 270 55 C350 25, 420 75, 500 35"
                                                fill="none"
                                                stroke="currentColor"
                                                className="text-blue-200"
                                                strokeWidth="2"
                                            />
                                        </svg>


                                        {/* Phone Circle */}
                                        <div
                                            className="
                                                relative
                                                z-10
                                                flex
                                                h-36
                                                w-36
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-gradient-to-br
                                                from-blue-900
                                                to-navy-950
                                                shadow-[0_25px_50px_rgba(15,23,42,0.25)]
                                                sm:h-40
                                                sm:w-40
                                            "
                                        >

                                            {/* Inner Border */}
                                            <div
                                                className="
                                                    absolute
                                                    inset-2
                                                    rounded-full
                                                    border
                                                    border-white/10
                                                "
                                            />


                                            {/* Phone Icon */}
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="
                                                    relative
                                                    z-10
                                                    h-16
                                                    w-16
                                                    text-white
                                                    sm:h-20
                                                    sm:w-20
                                                "
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            >
                                                <path
                                                    d="
                                                        M22 16.92v3a2 2 0 0 1-2.18 2
                                                        19.79 19.79 0 0 1-8.63-3.07
                                                        19.5 19.5 0 0 1-6-6
                                                        19.79 19.79 0 0 1-3.07-8.67
                                                        A2 2 0 0 1 4.11 2h3
                                                        a2 2 0 0 1 2 1.72
                                                        c.12.9.33 1.78.62 2.63
                                                        a2 2 0 0 1-.45 2.11L8 9.73
                                                        a16 16 0 0 0 6 6l1.27-1.27
                                                        a2 2 0 0 1 2.11-.45
                                                        c.85.29 1.73.5 2.63.62
                                                        A2 2 0 0 1 22 16.92z
                                                    "
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                {/* Signal */}
                                                <path
                                                    d="M15.5 4.5a5 5 0 0 1 4 4"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M15.5 1.5a8 8 0 0 1 7 7"
                                                    strokeLinecap="round"
                                                    opacity="0.65"
                                                />
                                            </svg>
                                        </div>


                                        {/* Floating Dots */}
                                        <div
                                            className="
                                                absolute
                                                right-10
                                                top-10
                                                h-3
                                                w-3
                                                rounded-full
                                                bg-blue-300/70
                                            "
                                        />

                                        <div
                                            className="
                                                absolute
                                                bottom-10
                                                left-14
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-slate-300
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ===================================================== */}
                {/* FAQ */}
                {/* ===================================================== */}

                <section
                    dir="rtl"
                    className="
                        relative
                        overflow-hidden
                        px-6
                        py-14
                        sm:px-8
                        md:py-20
                        lg:px-10
                    "
                >

                    <div className="container-luxury relative">

                        <div className="mx-auto max-w-3xl">

                            {/* FAQ Header */}
                            <div className="mb-10 text-center">

                                <div className="mx-auto mb-4 flex items-center justify-center gap-3">
                                    <span className="h-px w-12 bg-blue-200" />

                                    <span
                                        className="
                                            text-[11px]
                                            font-medium
                                            tracking-[0.3em]
                                            text-blue-400
                                        "
                                    >
                                        FAQ
                                    </span>

                                    <span className="h-px w-12 bg-blue-200" />
                                </div>


                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        text-navy-950
                                        sm:text-3xl
                                    "
                                >
                                    سوالات متداول
                                </h2>


                                <p
                                    className="
                                        mx-auto
                                        mt-3
                                        max-w-xl
                                        text-sm
                                        leading-7
                                        text-slate-500
                                    "
                                >
                                    پاسخ برخی از سوالات رایج شما را در این بخش
                                    قرار داده‌ایم تا بتوانید سریع‌تر اطلاعات
                                    مورد نیاز خود را پیدا کنید.
                                </p>
                            </div>


                            {/* FAQ Items */}
                            <div className="space-y-3">

                                {faqs.map((faq, index) => {
                                    const isOpen = openFaq === index;

                                    return (
                                        <div
                                            key={faq.question}
                                            className="
                                                overflow-hidden
                                                rounded-2xl
                                                border
                                                border-slate-200/80
                                                bg-white/90
                                                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
                                                backdrop-blur-sm
                                                transition-all
                                                duration-300
                                                hover:border-blue-100
                                                hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)]
                                            "
                                        >

                                            {/* Question */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenFaq(
                                                        isOpen ? null : index
                                                    )
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    px-5
                                                    py-5
                                                    text-right
                                                "
                                                aria-expanded={isOpen}
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        leading-6
                                                        text-navy-950
                                                    "
                                                >
                                                    {faq.question}
                                                </span>


                                                {/* Arrow */}
                                                <span
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-blue-50
                                                    "
                                                >
                                                    <ChevronDown
                                                        className={`
                                                            h-4 w-4
                                                            text-blue-700
                                                            transition-transform
                                                            duration-300
                                                            ${isOpen
                                                                ? 'rotate-180'
                                                                : ''
                                                            }
                                                        `}
                                                    />
                                                </span>
                                            </button>


                                            {/* Answer */}
                                            <div
                                                className={`
                                                    grid
                                                    transition-all
                                                    duration-300
                                                    ${isOpen
                                                        ? 'grid-rows-[1fr] opacity-100'
                                                        : 'grid-rows-[0fr] opacity-0'
                                                    }
                                                `}
                                            >
                                                <div className="overflow-hidden">

                                                    <p
                                                        className="
                                                            border-t
                                                            border-slate-100
                                                            px-5
                                                            pb-5
                                                            pt-4
                                                            text-sm
                                                            leading-7
                                                            text-slate-500
                                                        "
                                                    >
                                                        {faq.answer}
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

