export function Header({ dark, onTheme }) {
  return <header><a className="logo" href="/">رشد</a><nav><a href="#goals">هدف‌ها</a><a href="#profile">پروفایل</a><button className="theme" onClick={onTheme}>{dark ? "☀" : "◐"}</button><span className="avatar">م</span></nav></header>;
}
export function Sidebar({ active, onSelect }) {
  return <aside>{["خانه", "جلسه کوچینگ", "هدف‌های من", "پیشرفت", "پروفایل"].map(item => <button className={active === item ? "active" : ""} onClick={() => onSelect(item)} key={item}>{item}</button>)}</aside>;
}
export function Footer() { return <footer>رشد، فضایی امن برای توسعه فردی</footer>; }
