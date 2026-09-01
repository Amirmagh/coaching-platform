import { useState } from "react";
export function useCoachingSession() { const [messages, setMessages] = useState([]); return { messages, addMessage: message => setMessages([...messages, message]) }; }
