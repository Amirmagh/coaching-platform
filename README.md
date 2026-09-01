# پلتفرم کوچینگ رشد

پلتفرم کوچینگ فارسی مبتنی بر مدل GROW، با API جنگو و رابط واکنش‌گرا و RTL.

## اجرا

```bash
cp .env.example .env
python -m pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py createsuperuser --username admin --email admin@coaching.ir
python manage.py runserver
```

سؤال‌های فارسی GROW و منابع بحران ایران در migration اولیه افزوده می‌شوند. برای اجرای رابط کاربری:

```bash
cd frontend
npm install
npm run dev
```

رابط در `http://localhost:5173` و API در `http://localhost:8000/api/` در دسترس هستند. ثبت‌نام، دریافت JWT، سؤال‌ها، منابع بحران و جلسات کوچینگ از مسیرهای `/api/auth/signup/`، `/api/auth/token/`، `/api/questions/`، `/api/crisis-resources/` و `/api/sessions/` ارائه می‌شوند.
