export function Button({ children }) { return <button className="button">{children}</button>; }
export function Card({ title, value, detail, children }) { return <article className="card"><p>{title}</p><strong>{value}</strong><small>{detail}</small>{children}</article>; }
export function Modal({ children }) { return <div className="modal">{children}</div>; }
export function LoadingSpinner() { return <span className="spinner" aria-label="در حال بارگذاری" />; }
