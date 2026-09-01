export function ChatMessage({ message, mine = false }) { return <p className={mine ? "message mine" : "message"}>{message}</p>; }
export function MessageInput() { return <textarea placeholder="پیام خود را بنویسید…" />; }
export function CrisisAlert() { return <aside className="crisis">اگر در خطر فوری هستید با ۱۱۵ یا ۱۲۳ تماس بگیرید.</aside>; }
export function QuestionCard({ question }) { return <article className="question-card">{question}</article>; }
