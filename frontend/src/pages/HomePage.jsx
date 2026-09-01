import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="hero">
      <h1>پلتفرم کوچینگ هوشمند</h1>
      <p>
        بر اساس مدل GROW و ۸ شایستگی اصلی ICF، همراه شما در مسیر رشد فردی و
        حرفه‌ای. گفتگویی امن، بدون قضاوت، و همیشه در کنار شما.
      </p>
      <Link to="/coaching">
        <button className="btn-primary" type="button">
          شروع جلسه کوچینگ
        </button>
      </Link>
    </div>
  );
}

export default HomePage;
