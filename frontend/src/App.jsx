import { useState } from "react";
import { Header, Sidebar } from "./components/Layout";
import { Card, Button } from "./components/Shared";
import "./styles/globals.css";

const questions = ["دوست دارید در پایان این جلسه به چه چیزی برسید؟", "اکنون چه چیزی شما را به چالش می‌کشد؟", "چه گزینه‌ای می‌تواند شما را یک قدم جلو ببرد؟"];

export default function App() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("خانه");
  return <main className={dark ? "app dark" : "app"}>
    <Header dark={dark} onTheme={() => setDark(!dark)} />
    <div className="shell"><Sidebar active={active} onSelect={setActive} />
      <section className="content">
        <p className="eyebrow">همراه رشد شما</p>
        <h1>{active === "خانه" ? "به مسیر خودتان معنا بدهید" : active}</h1>
        <p className="intro">کوچینگ ساختارمند GROW برای روشن‌کردن هدف، دیدن واقعیت و حرکت آگاهانه.</p>
        <div className="stats"><Card title="تداوم این هفته" value="۴ روز" detail="۲ روز بیشتر از هفته قبل" /><Card title="هدف فعال" value="۳" detail="همه در مسیر درست" /><Card title="پیشرفت کلی" value="۷۲٪" detail="رشد پایدار" /></div>
        <div className="grid">
          <Card title="جلسه بعدی" value="گفت‌وگوی امروز" detail="یک سؤال برای شروع آماده است"><Button>شروع جلسه</Button></Card>
          <Card title="نقشه GROW" value="هدف ← واقعیت ← گزینه‌ها ← عمل" detail="روی مرحله هدف هستید"><div className="progress"><span /></div></Card>
        </div>
        <section className="question"><p className="eyebrow">پرسش پیشنهادی</p><h2>{questions[0]}</h2><textarea placeholder="پاسخ خود را اینجا بنویسید…" /><Button>ادامه گفت‌وگو</Button></section>
      </section>
    </div>
  </main>;
}
