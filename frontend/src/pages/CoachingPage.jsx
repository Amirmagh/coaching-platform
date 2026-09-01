import { useEffect, useRef, useState } from "react";
import { coaching } from "../api/client";

function CoachingPage() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [crisis, setCrisis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const nextLocalId = useRef(0);

  const makeLocalId = () => {
    nextLocalId.current += 1;
    return `local-${nextLocalId.current}`;
  };

  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await coaching.createSession();
        setSessionId(response.data.id);
      } catch {
        setError("برای شروع جلسه ابتدا باید وارد حساب کاربری خود شوید.");
      }
    };
    startSession();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userText = input;
    setMessages((prev) => [
      ...prev,
      { id: makeLocalId(), sender: "user", text: userText },
    ]);
    setInput("");
    setLoading(true);
    setCrisis(null);

    try {
      const response = await coaching.sendMessage(sessionId, userText);
      const { coach_message: coachMessage, crisis: crisisInfo } = response.data;
      if (crisisInfo && crisisInfo.requires_immediate_action) {
        setCrisis(crisisInfo);
      }
      if (coachMessage) {
        setMessages((prev) => [
          ...prev,
          { id: coachMessage.id, sender: coachMessage.sender, text: coachMessage.text },
        ]);
      }
    } catch {
      setError("ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>جلسه کوچینگ</h1>
      {error && <p className="crisis-resources">{error}</p>}

      <div className="card">
        <div className="chat-window">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message ${m.sender}${
                m.sender === "system" ? " crisis" : ""
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {crisis && (
          <div className="crisis-resources">
            <strong>منابع کمک فوری:</strong>
            <ul>
              {crisis.resources.map((resource) => (
                <li key={resource.phone}>
                  {resource.name_fa} — {resource.phone} ({resource.available})
                </li>
              ))}
            </ul>
          </div>
        )}

        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="پیام خود را بنویسید..."
            disabled={loading || !sessionId}
          />
          <button className="btn-primary" type="submit" disabled={loading || !sessionId}>
            ارسال
          </button>
        </form>
      </div>
    </div>
  );
}

export default CoachingPage;
