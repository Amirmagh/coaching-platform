# پلتفرم کوچینگ (Coaching Platform)

پلتفرم کوچینگ مبتنی بر مدل **GROW** با موتور انتخاب سوال هوشمند، همسو با
**۸ شایستگی اصلی ICF** (فدراسیون بین‌المللی کوچینگ)، شامل بک‌اند Django REST
Framework و فرانت‌اند React (با پشتیبانی کامل از راست‌به‌چپ/RTL برای فارسی).

## ✅ ویژگی‌های این نسخه (Initial Setup)

- **موتورهای شایستگی ICF**: تعریف ۸ شایستگی اصلی کوچینگ (اخلاق حرفه‌ای، ذهنیت
  کوچینگ، توافقات، اعتماد و امنیت، حضور، گوش دادن فعال، برانگیختن آگاهی، تسهیل رشد).
- **موتور شناسایی بحران (Crisis Detection)**: بررسی فوری و بدون تأخیر پیام‌های
  کاربر برای علائم بحران (افکار خودکشی، خودآزاری، آسیب به دیگران) به فارسی و
  انگلیسی، همراه با منابع کمک اورژانسی مخصوص ایران.
- **موتور ارزیابی پاسخ (Response Validation)**: بررسی می‌کند که پاسخ کوچ نه
  توصیه بدهد، نه تشخیص/تفسیر کند و نه قضاوت داشته باشد — کاملاً همسو با
  اصول ICF.
- **موتور جریان سوال (Question Flow)**: انتخاب سوال بعدی بر اساس مراحل مدل
  GROW (هدف، واقعیت، گزینه‌ها، اراده).
- **مدل‌های داده**: کاربر (User)، جلسه (Session)، هدف (Goal)، پیام (Message)،
  پرداخت (Payment)، رویداد تحلیلی (AnalyticsEvent).
- **API کامل** با Django REST Framework و احراز هویت JWT.
- **فرانت‌اند React** با صفحات خانه، جلسه کوچینگ و داشبورد، RTL و فارسی.
- **پیکربندی Docker** برای اجرای بک‌اند، فرانت‌اند و پایگاه‌داده با یک دستور.

## ساختار پروژه

```
backend/                  # Django REST Framework API
  config/                 # تنظیمات پروژه (settings, urls)
  apps/
    users/                # مدل کاربر سفارشی + احراز هویت
    coaching/              # جلسات، اهداف، پیام‌ها + موتورهای کوچینگ
      engines/
        competencies.py    # ۸ شایستگی ICF
        crisis_detection.py
        response_validation.py
        question_flow.py
    payments/              # مدل پرداخت
    analytics/             # رویدادهای تحلیلی
frontend/                  # React (Vite) + RTL
docker-compose.yml
```

## راه‌اندازی محلی (بدون Docker)

### بک‌اند

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API روی `http://localhost:8000/api/` در دسترس خواهد بود.

### فرانت‌اند

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

فرانت‌اند روی `http://localhost:5173` در دسترس خواهد بود.

## راه‌اندازی با Docker

```bash
docker compose up --build
```

- بک‌اند: `http://localhost:8000`
- فرانت‌اند: `http://localhost:3000`
- دیتابیس PostgreSQL روی پورت ۵۴۳۲

## اجرای تست‌ها

```bash
cd backend
python manage.py test apps
```

## نکات مهم امنیتی و بالینی

- شناسایی بحران **فوری** و به‌صورت **همگام (synchronous)** انجام می‌شود؛ هیچ
  تماس شبکه‌ای در مسیر بحرانی وجود ندارد.
- موتور ارزیابی پاسخ از ارائه **تفسیر، تشخیص یا قضاوت** توسط سیستم جلوگیری
  می‌کند و اصل «مراجع صاحب پاسخ‌هاست» را رعایت می‌کند.
- منابع بحران فعلاً شامل شماره‌های اورژانس اجتماعی (۱۲۳)، خط بحران بهزیستی
  (۱۴۸۰) و فوریت‌های پزشکی (۱۱۵) است.

## گام‌های بعدی

- طراحی مجدد رابط کاربری هم‌راستا با استایل BetterUp.
- افزودن پرداخت آنلاین (درگاه ایرانی).
- گسترش بانک سوالات GROW و شخصی‌سازی بیشتر بر اساس تاریخچه مراجع.
