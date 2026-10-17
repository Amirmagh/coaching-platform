# Scalp trading Telegram bot (paper mode)

این پروژه شامل سه سرویس ساده است که با هم یک pipeline سیگنال‌دهی و شبیه‌سازی ترید را فراهم می‌کنند:

- strategy_engine.py: موتور تولید سیگنال (EMA crossover روی کندل 5m)
- telegram_service.py: ارسال سیگنال به تلگرام و دریافت تایید/رد با دکمه‌ها
- execute_service.py: سرویس اجرای شبیه‌سازی سفارشات (ذخیره در sqlite)

مهم: هرگز توکن تلگرام یا کلید API صرافی را داخل این repo commit نکنید. از فایل config.json محلی استفاده کنید.

نصب سریع (با Docker)
1) در پوشهٔ پروژه، یک فایل config.json بسازید (مطابق config.example.json) و مقادیر telegram.bot_token و telegram.chat_id را قرار دهید.

2) اگر Docker و docker-compose نصب دارید:

   docker-compose up --build -d

3) برای مشاهده لاگ‌ها:

   docker-compose logs -f

4) برای توقف:

   docker-compose down

اجرای محلی بدون Docker
1) نصب پایتون 3.8+
2) ساخت virtualenv و نصب:

   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

3) قرار دادن config.json در ریشهٔ پروژه (بدون commit)
4) اجرای سرویس‌ها در سه ترمینال جداگانه:

   python telegram_service.py
   python execute_service.py
   python strategy_engine.py

تست دستی
- ارسال یک سیگنال تست:

  curl -X POST http://localhost:8000/signal -H "Content-Type: application/json" -d '{"pair":"BTC/USDT","time":"2026-10-17T12:00:00Z","price":50000,"type":"LONG","recommended_stake":50}'

- باید در تلگرام پیام با دکمهٔ Confirm/Reject ببینی.

تنظیمات از طریق تلگرام
- می‌توان با دستور /set_stake 100 مقدار stake پیش‌فرض را تغییر داد.

نکات امنیتی و بعدی
- قبل از فعال کردن auto-mode حتماً روزها یا هفته‌ها paper-run کن.
- برای اجرا روی سرور از secret manager یا متغیر محیطی برای نگهداری توکن‌ها استفاده کن.

اگر می‌خواهی من فایل config.json را (با مقادیر توکن تو) در یک branch خصوصی یا به‌صورت commit انجام دهم، ابتدا تأیید کن که repo خصوصی است و با ریسک قرار دادن توکن در repo موافقی. بهتر است که تو خودت فایل config.json را بسازی و در سیستم خودت قرار دهی.
